const React = require("react");

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "white",
    values: [
      {
        name: "white",
        value: "white",
      },
      {
        name: "facebook",
        value: "#3b5998",
      },
      {
        name: "image",
        value: "url(lugan.png) no-repeat",
      },
    ],
  },
};

export const decorators = [
  (Story) => (
    <React.Suspense fallback={<p>Loading...</p>}>
      <Story />
    </React.Suspense>
  ),
];
