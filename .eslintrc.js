module.exports = {
    "extends": "airbnb",
    "env": {
        "jest": true,
    },
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    },
    globals: {
        'document': false,
        'window': false
    }
};