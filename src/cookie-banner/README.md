# Cookie banner elements `<cookie-banner>`

This component displays a cookie banner and emit events when the cookie is accepted or refused.

## Usage

You can have a simple accept / reject cookie banner

```html
<cookie-banner>
  <p>Whatever content you may want</p>
  <button data-accept>I accept</button>
  <button data-reject>I refuse</button>
</cookie-banner>
```

Or you can use a form for multi level cookie acceptance.

```html
<cookie-banner>
  <p>Whatever content you may want</p>
  <form action="">
  <p>
      <input type="checkbox" disabled checked> Required cookie
      <input type="checkbox" name="tracking" value="1" checked> Tracking cookies
    </p>
    <p>
      <button data-accept>I accept</button>
      <button data-reject>I refuse</button>
    </p>
  </form>
</cookie-banner>
```

### Attributes

| Attribute       | Type     | Description                                          |
|-----------------|----------|------------------------------------------------------|
|                 |          |                                                      |

### Events

| EventName       | Description                   | Detail     |
|-----------------|-------------------------------|------------|
| accept          | The user accepted the cookie  | {formData} |
| reject          | The user rejected the cookie  | {}         |

### Methods

| Name                          | Params   | Description                                          |
|-------------------------------|----------|------------------------------------------------------|
| CookieBanner.hasConsent()     |          | false|object check if user agreed to cookies         |


### CSS Custom Properties

| Property                    |
|-----------------------------|
|                             |
