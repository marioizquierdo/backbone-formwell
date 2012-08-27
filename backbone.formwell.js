(function() {

  Backbone.Formwell = (function() {

    function Formwell(options) {
      this.model = options.model;
      this.view = options.view;
    }

    Formwell.prototype.set = function(attrName, value) {
      var $input, attrs, errorMsg, errors, _results;
      if (!attrName) {
        throw "formwell.set error: Can not set in an undefined field";
      } else if (_.isElement(attrName) || _.isElement(attrName[0])) {
        $input = $(attrName);
        attrs = {};
        attrs[$input.attr('name')] = this.getInputValue($input);
      } else if (_.isString(attrName)) {
        attrs = {};
        attrs[attrName] = value;
      } else if (_.isObject(attrName)) {
        attrs = attrName;
      }
      this.model.set(attrs);
      this.model.validateModel();
      errors = this.model.errors;
      _results = [];
      for (attrName in attrs) {
        value = attrs[attrName];
        if (errors && (errorMsg = errors[attrName])) {
          _results.push(this.showErrorFor(attrName, errorMsg));
        } else {
          _results.push(this.hideErrorFor(attrName));
        }
      }
      return _results;
    };

    Formwell.prototype.validate = function() {
      var attrName, errorMsg, errors;
      errors = this.model.validateModel();
      this.hideAllErrors();
      if (errors) {
        for (attrName in errors) {
          errorMsg = errors[attrName];
          this.showErrorFor(attrName, errorMsg);
        }
      }
      return errors;
    };

    Formwell.prototype.getInputValue = function(input) {
      input = $(input);
      if (input.is('[type=checkbox]')) {
        return input.prop('checked');
      } else {
        return input.val();
      }
    };

    Formwell.prototype.showErrorFor = function(attrName, errorMsg) {
      var $errorEl, $inputEl;
      $inputEl = this.findInputFor(attrName);
      $errorEl = this.formErrorFindOrCreateErrorEl(attrName, $inputEl);
      $errorEl.text(errorMsg).show();
      return $inputEl.parents('.form-row').andSelf().addClass('with-error-message');
    };

    Formwell.prototype.hideErrorFor = function(attrName) {
      var $errorEl, $inputEl;
      $inputEl = this.findInputFor(attrName);
      $errorEl = this.formErrorFindOrCreateErrorEl(attrName, $inputEl);
      $errorEl.hide();
      return $inputEl.parents('.form-row').andSelf().removeClass('with-error-message');
    };

    Formwell.prototype.hideAllErrors = function() {
      this.formErrorFindAllErrorsEl().hide();
      return this.findAllInputs().parents('.form-row').andSelf().removeClass('with-error-message');
    };

    Formwell.prototype.findInputFor = function(attrName) {
      return this.view.$("[name='" + attrName + "']");
    };

    Formwell.prototype.findAllInputs = function() {
      return this.view.$("[name]");
    };

    Formwell.prototype.formErrorFindOrCreateErrorEl = function(attrName, $inputEl) {
      var $errorEl;
      $errorEl = this.view.$(".error-message[data-name='" + attrName + "']");
      if ($errorEl.length === 0) {
        $errorEl = jQuery("<span class='error-message' data-name='" + attrName + "'>error</span>");
        $inputEl.after($errorEl);
      }
      return $errorEl;
    };

    Formwell.prototype.formErrorFindAllErrorsEl = function() {
      return this.view.$(".error-message[data-name]");
    };

    return Formwell;

  })();

}).call(this);
