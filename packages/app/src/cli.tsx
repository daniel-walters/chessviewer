#!/usr/bin/env node

import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui.js";

const cli = meow(
	`
	Usage
	  $ app

	Options
		--name  Your name

	Examples
	  $ app --name=Jane
	  Hello, Jane
`,
	{
		flags: {
			name: {
				type: "string",
			},
		},
	}
);

render(<App name={cli.flags.name} />);
