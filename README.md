Backbone Formwell
=================

Write the form validation logic in the model
and let formwell show the errors in the view
as soon as the user enters something in the input fields.

Scope
-----

The goal is to have easy form validation for Backbone applications.

It doesn't have fancy methods to implement the validation logic, it doesn't have fancy declarative bindings and it doesn't have fancy view helpers to generate the form markup. It is just a simple convention to easily show model validation errors in the form.

Install
-------

Include the `backbone.formwell` script after `backbone`. For example:

```html
<script type="text/javascript" src="backbone.min.js"></script>
<script type="text/javascript" src="backbone.formwell.min.js"></script>
```

Usage
-----

Create an instance of `Backbone.Formwell` with a reference to the View and the Model:

```coffeescript

MyView extends Backbone.View
  el: 'form'

  initialize: ->
    this.formwell = new Backbone.Formwell(model: this.model, view: this)

```

Link each input, textarea or select tag with the respective model attribute using the html name attribute in the template:

```html
<form>
  <input type="text" name="firstName" value=""/>
</form>
```

Don't implement Backbone.Model `validate` method, and don't override `isValid`. Those methods need to be left untouched, because we want `set` and `save` to work properly even if the model is invalid, in order to keep the form and the model attributes in sync. (Backbone methods `set` and `save` depend on the `validation` method in a way that is too confusing for a dinamic form, the easiest workaround I could find is to just avoid using `validate`).

Formwell will expect the model to have the method `validateModel` instead.
Create the method `validateModel` in the model. If model.attributes are valid, don't return anything from validateModel;
if they are invalid, return an errors object, where keys are the invalid attribute names and the values the error messages.

For example:

```coffeescript
User extends Backbone.Model

  validateModel: ->
    errors = {}
    errors['firstName'] = 'Can not be blank' if not this.get('firstName')
    return errors unless _.isEmpty(errors)
```


Whenever a form input changes, use `formwell.set(attrName, value)` instead of `model.set(attrName, value)`

On form submit, use `formtroll.validate()` before saving the model to ensure there are no errors left in the form.

Example:

```coffeescript
class Form extends Backbone.View
  el: 'form'

  events:
    "change input, textarea, select": "validateInput"
    "submit": "validateFormAndSave"

  initialize: ->
    this.formwell = new Backbone.Formwell(model: this.model, view: this)

  validateInput: (event) ->
    $input = $(event.currentTarget)
    this.formwell.set($input)

  validateFormAndSave: (event)->
    event.preventDefault()
    if errors = this.formwell.validate()
      alert("Can not save because there are errors in the form")
    else
      this.model.save()
```


When the user changes a form input, formwell will set the value in the model attribute with the same name.

If there is an error in that attribute, it will show the error message in the form.


Customization
-------------

### Errors, position and Styles ###

Formwell will create a DOM element to show the error right next to the invalid input.

For example, given this input:

```html
<input type="text" name="firstName" value=""/>
```

If the user unfocus the input with an invalid value, formwell will create the error element:

```html
<input class="with-error-message" type="text" name="firstName" value=""/>
<span class="error-message" data-name="firstName">Can not be blank</span>
```

If the error element already exists, it will not create a new one, so create it on your own template if you want to show the error message in a different place, just be sure to include the css class "error-message" and set the data-name attribute to
the same referenced model attribute name.

When there is an error in an input field, formwell will also add the class "with-error-message" to the input, and also to the parent with class "form-row" if any.

For example, given this markup:

```html
<div class="form-row">
  <label>First Name</label>
  <div class="input-wrapper">
    <input type="text" name="firstName" value=""/>
    <p class="hint">Please don't use a fake name</p>
  </div>
  <div class="error-message" data-name="firstName" style="display:none"></div>
</div>
```

If the user unfocus the input with an invalid value, formwell will add the error message and error class:

```html
<div class="form-row with-error-message">
  <label>First Name</label>
  <div class="input-wrapper">
    <input class="with-error-message" type="text" name="firstName" value=""/>
    <p class="hint">Please don't use a fake name</p>
  </div>
  <div class="error-message" data-name="firstName">Can not be blank</div>
</div>
```

Use this to style the error messages.


### Errors on the model itself ###

You don't need an input or model attribute in order to show an error.
You can put something like this in your markup:

```html
<span class="error-message" data-name="base" />
```

and then add error messages non related to a specific attribute in the key "base",
for example the validate method could return something like `{base: "There are errors on this form"}` and it will be shown in the related element.


### Nested models or lists ###

Formwell can only set first level attributes (using `model.set`).
But you can add a "change" event listener in the model to assign the real model value (or override set, but is not recommended).

The attribute name will be used only to link the model with the form.
For example, if you have a model `User` with a nested `Address` model with several
attributes like city, state, etc. You could set the input name to `address[city]`,
and return something like `{"address[city]": "city does not exist"}` in the validation errors object.

But to actually set the value in the nested address model, you need something like this in the User model:

```coffeescript
User extends Backbone.Model
  initialize: ->
    this.on 'change', (model, options) ->
      for attrName, value of options.changes
        # Set nested values in address
        if m = attrName.match(/^address\[(.+)\]/)
          addressAttrName = m[1]
          model.get("address").set(addressAttrName, value)
```

### Internacionalization ###

You should use your own library for this, and implement the The `validateModel` method to return the error messages already translated.


## Contributions ##

Github makes it easy! open a new issue or branch the project and send a pull request.

## Changelog ##

 * *1.0.0* (Aug 27, 2012): Initial release

## Author ##

Written by [Mario Izquierdo](https://github.com/marioizquierdo)