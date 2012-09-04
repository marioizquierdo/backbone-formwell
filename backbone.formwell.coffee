###!
Backbone Formwell 0.0.3
Write the form validation logic in the model and let formwell show the errors in the view as soon as the user enters something in the input fields.
https://github.com/marioizquierdo/backbone-formwell
###
class Backbone.Formwell

  constructor: (options)->
    @model = options.model
    @view = options.view

  # Set the attribute in the model, validate and show errors in the form.
  #
  # Signatures:
  #
  #   set(attrs)           => model set attr.name = attr.value for each attr of attrs
  #   set(attrName, value) => model set attrName = value
  #   set(inputDomEl)      => model set inputDomEl attr name = inputDomEl value
  #
  set: (attrName, value) ->
    # Handle arguments
    if not attrName
      throw "formwell.set error: Can not set in an undefined field"

    else if _.isElement(attrName) or _.isElement(attrName[0]) # set(inputDomEl)
      $input = $(attrName)
      attrs = {}
      attrs[$input.attr('name')] = @getInputValue($input)

    else if _.isString(attrName) # set(attrName, value)
      attrs = {}
      attrs[attrName] = value

    else if _.isObject(attrName) # set(attrs)
      attrs = attrName

    @model.set(attrs)
    errors = @model.validateModel()
    for attrName, value of attrs
      if errors and errorMsg = errors[attrName] # show error for this field only
        @showErrorFor(attrName, errorMsg)
      else
        @hideErrorFor(attrName)

  # Validate model and show all errors in the form
  validate: ->
    errors = @model.validateModel()
    @hideAllErrors() # hide all errors first
    @showErrorFor(attrName, errorMsg) for attrName, errorMsg of errors if errors # show all validation errors if any
    errors

  # Get and parse a from input value (input, textarea or select).
  # This will return boolean (true or false) values from checkboxes,
  # and a text from all other input types.
  getInputValue: (input)->
    input = $(input) # ensure jquery object
    if input.is('[type=checkbox]')
      input.prop('checked')
    else
      input.val()

  # Show the error message for the model attribute in the form markup:
  #  * the error element text will be set to errorMsg,
  #  * the css class .with-error-message will be added to the input element, and any parents with class .form-row (for styling).
  showErrorFor: (attrName, errorMsg) ->
    $inputEl = @findInputFor(attrName)
    $errorEl = @formErrorFindOrCreateErrorEl(attrName, $inputEl)
    $errorEl.text(errorMsg).show()
    $inputEl.parents('.form-row').andSelf().addClass('with-error-message')

  # Revert the changes made by showFormError:
  # hide the error message for the attrName input and remove the added .with-error-message css class
  # if attrName is undefined, hide all errors in the form.
  hideErrorFor: (attrName) ->
    $inputEl = @findInputFor(attrName)
    $errorEl = @formErrorFindOrCreateErrorEl(attrName, $inputEl)
    $errorEl.hide()
    $inputEl.parents('.form-row').andSelf().removeClass('with-error-message')

  # Same as hideErrorFor, but for all errors in the form
  hideAllErrors: ->
    @formErrorFindAllErrorsEl().hide()
    @findAllInputs().parents('.form-row').andSelf().removeClass('with-error-message')

  # Find the form input (or textarea or select) element asociated with the model attribute.
  # The input element should have the same html attribute "name" as the attrName argument.
  findInputFor: (attrName) -> @view.$("[name='#{attrName}']")

  # Find all form inputs (or textarea or select) elements, that could have an error.
  findAllInputs: -> @view.$("[name]")

  # Find the html element where to show the error message,
  # or create it in a default position if it doesn't exist (so it's only needed in the markup is it needs to be in a weird place).
  # The error element should be a span.error-message with the same html attribute "data-name" as the attrName argument.
  formErrorFindOrCreateErrorEl: (attrName, $inputEl) ->
    $errorEl = @view.$(".error-message[data-name='#{attrName}']")
    if $errorEl.length is 0 # if there is no error-message element, create one and put next to the input
      $errorEl = jQuery("<span class='error-message' data-name='#{attrName}'>error</span>")
      $inputEl.after($errorEl)
    $errorEl

  # Find all error elements in the form (created or identified by formErrorFindOrCreateErrorEl)
  formErrorFindAllErrorsEl: -> @view.$(".error-message[data-name]")