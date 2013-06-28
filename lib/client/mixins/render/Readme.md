
# render

  Render boilerplate for bquery/backbone

  Declares a method called 'render' on your view that automatically passes your
  model to your template.

## Installation

    $ component install bquery/render

## Example

```js
var render = require('render');
var view = bquery.view();

// All arguments are optional except template. Everything that can be a value
// can also be a function.
view.use(render({
  // required. Template function
  template: function(d) { return "<div>" + d.model + "</div>"; }

  // optional. default false. Treat the template function as an async function
  async: true,

  // optional. Uses this.model by default
  model: function() { return "hey"; }

  // optional. default false. If true, call toJSON on this.model before passing to template
  raw: false,

  // optional. Extra data to pass into template
  extra: { pie: yum }
}));

MyView = view.make();
```

## License

  MIT
