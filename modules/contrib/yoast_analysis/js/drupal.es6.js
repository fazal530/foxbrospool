import "regenerator-runtime/runtime";

import {
    ContentAssessor,
    Paper,
    SeoAssessor
} from "yoastseo";

import AssessorPresenter from "yoastseo/src/renderers/AssessorPresenter";

import Jed from "jed";

import jQuery from "jquery";
import Drupal from "drupal";
import drupalSettings from "drupal_settings";

const I18n = function () {}

I18n.prototype.dgettext = function (domain, key) {
    return key;
};

I18n.prototype.dngettext = function (domain, skey, pkey, val) {
    return val === 1 ? skey : pkey;
};

I18n.prototype.sprintf = function () {
    return Jed.sprintf.apply(this, arguments);
};

const SnippetRenderer = function (target) {
    this.target = target;
}

SnippetRenderer.prototype.render = function (paper) {
    jQuery('.snippet-title', this.target).text(paper.getTitle());
    jQuery('.snippet_container__url .urlFull .url', this.target).text(paper.getPermalink());
    jQuery('.snippet_container__meta .desc', this.target).text(paper.getDescription());
}

const App = function (config) {
    this.i18n = new I18n();

    this.seoAssessor = new SeoAssessor(this.i18n, { marker: config.marker });
    this.contentAssessor = new ContentAssessor(this.i18n, { marker: config.marker, locale: config.locale });

    this.seoAssessorPresenter = new AssessorPresenter({
        targets: {
            output: config.targets.output,
        },
        assessor: this.seoAssessor,
        i18n: this.i18n,
    });
    this.seoAssessorPresenter.disableMarkerButtons();

    this.contentAssessorPresenter = new AssessorPresenter( {
        targets: {
            output: config.targets.contentOutput,
        },
        assessor: this.contentAssessor,
        i18n: this.i18n,
    });
    this.contentAssessorPresenter.disableMarkerButtons();

    this.snippetRenderer = new SnippetRenderer(config.targets.snippet)
};

App.prototype.analyse = function (paper) {
    this.seoAssessor.assess(paper);
    this.seoAssessorPresenter.setKeyword(paper.getKeyword());
    this.seoAssessorPresenter.render();

    this.contentAssessor.assess(paper);
    this.contentAssessorPresenter.renderIndividualRatings();

    this.snippetRenderer.render(paper);
};

((Drupal, drupalSettings, $, once) => {
    Drupal.behaviors.yoastAnalysis = {
        attach: function (context) {
            const elements = once('yoast-analysis', '.yoast-analysis', context);
            if(elements.length == 0) {
                return;
            }
            $(elements).each(function () {
                let container = $(this);
                let settingsKey = container.attr('id');
                let settings = drupalSettings.yoast_analysis.container_settings && drupalSettings.yoast_analysis.container_settings[settingsKey] ? drupalSettings.yoast_analysis.container_settings[settingsKey] : {};

                const buildPaper = function () {
                    return new Paper(settings.analysis_data.text, {
                        keyword: $('.yoast-analysis__keyword', container).val(),
                        title: settings.analysis_data.title,
                        titleWidth: $('.snippet_container__title', container).width(),
                        description: settings.analysis_data.description,
                        url: settings.analysis_data.path,
                        permalink: settings.analysis_data.base_url + settings.analysis_data.path,
                        locale: settings.analysis_data.locale,
                    });
                }

                let app = new App({
                    locale: settings.analysis_data.locale,
                    targets: {
                        snippet: $('.yoast-analysis__snippet', container),
                        output: $('.yoast-analysis__output', container).attr('id'),
                        contentOutput: $('.yoast-analysis__content-output', container).attr('id'),
                    },
                });

                app.analyse(buildPaper());

                $('.yoast-analysis__keyword').on('keyup', e => {
                    if (e.key === 'Enter' || e.keyCode === 13) {
                        app.analyse(buildPaper());
                    }
                });
                $('.yoast-analysis__refresh', container).click(() => {
                    app.analyse(buildPaper());
                });
            });
        }
    };
})(Drupal, drupalSettings, jQuery, once);
