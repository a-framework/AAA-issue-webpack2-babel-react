# Tree-shaking with Webpack 2, Babel 6 and React - aliasing issue

There is a project under `components/` folder.

In that folder - there is a React component `Component` - in `component.js` file.

There is an additional, separate project under `utils/super-decorators/` folder,
and it contains two more React "components": `ComponentDecorator` and `ContainerDecorator`.

It's `index.js` file is **built** to support tree-shaking:

```
import _Container from './container';
export { _Container as Container };

import _Component from './component';
export { _Component as Component };
```

In `Component` the consumption looks like this:

```
import React, {Component} from 'react';

import {Container} from 'decorators/lib';

export default class MyComponent extends Component {
    render() {
        return (
            <div>MyComponent</div>
        );
    }
}
```

and the expectation is that only `ContainerDecorator` is exported with the eventual package.

**This doesn't happen**, probably because, in order to consume the `ContainerDecorator` above, there is a need to hack around using `npm link` or `resolve.alias` in Webpack:

```
module.exports = {
    entry: {
        a: './lib/component.js',
        vendor: ['react']
    },
    output: {
        path: './dist/',
        filename: '[name].js'
    },
    resolve: {
        alias: {
            'decorators': path.resolve(__dirname, '../utils/super-decorators/'),
            'react': require.resolve('react')
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: [
                        require.resolve('babel-preset-es2015-webpack'),
                        require.resolve('babel-preset-react')
                    ]
                }
            }
        ]            
    }
};
```

> All the seeming hacks above were necessary to actually allow Webpack/Babel to
> properly resolve and process `ContainerDecorator`.

This setup, however, results in both `ContainerDecorator` and `ComponentDecorator` 
to be exported.

What gives...?
