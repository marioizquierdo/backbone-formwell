// Generated by CoffeeScript 1.3.3

/*!
Backbone Formwell 1.0.0
Simple Model-View Form Validation.
Write validation logic in the Model and let Formwell show the errors in the View as soon as the user types something in the input fields.
https://github.com/marioizquierdo/backbone-formwell
*/


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
      errors = this.model.validateModel();
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
      var $error, $input;
      $input = this.findInputFor(attrName);
      $error = this.findOrCreateError(attrName, $input);
      $error.text(errorMsg).show();
      $input.addClass('with-error-message');
      return $error.parents('.form-row').addClass('with-error-message');
    };

    Formwell.prototype.hideErrorFor = function(attrName) {
      var $error, $input;
      $input = this.findInputFor(attrName);
      $error = this.findOrCreateError(attrName, $input);
      $input.removeClass('with-error-message');
      $error.parents('.form-row').removeClass('with-error-message');
      return $error.hide();
    };

    Formwell.prototype.hideAllErrors = function() {
      var $error, $input;
      $input = this.findAllInputs();
      $error = this.findAllErrors();
      $input.removeClass('with-error-message');
      $error.parents('.form-row').removeClass('with-error-message');
      return $error.hide();
    };

    Formwell.prototype.findInputFor = function(attrName) {
      return this.view.$("[name='" + attrName + "']");
    };

    Formwell.prototype.findAllInputs = function() {
      return this.view.$("[name]");
    };

    Formwell.prototype.findOrCreateError = function(attrName, $input) {
      var $error;
      $error = this.view.$(".error-message[data-name='" + attrName + "']");
      if ($error.length === 0) {
        $error = $("<span class='error-message' data-name='" + attrName + "'>error</span>");
        $input.after($error);
      }
      return $error;
    };

    Formwell.prototype.findAllErrors = function() {
      return this.view.$(".error-message[data-name]");
    };

    return Formwell;

  })();

}).call(this);
