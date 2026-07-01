/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * JavaScript Eval operation
 */
class JSEvaluate extends Operation {

    /**
     * JSEvaluate constructor
     */
    constructor() {
        super();

        this.name = "JavaScript Eval";
        this.module = "Code";
        this.description = [
            "Executes (evaluates) JavaScript code and returns the result as a string.",
            "<br><br>",
            "If the Script argument is empty, the input data is treated as JavaScript code and evaluated directly.",
            "<br><br>",
            "If the Script argument contains code, the input data is inserted into the script using the specified placeholder template and then evaluated.",
        ].join("\n");
        this.infoURL = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Input placeholder",
                "type": "string",
                "value": "[%input%]"
            },
            {
                "name": "Script",
                "type": "text",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [placeholder, script] = args;

        try {
            // Determine what code to evaluate
            let codeToEvaluate;
            if (script && script.trim().length > 0) {
                // Use the script from argument, replacing placeholder with input
                codeToEvaluate = script.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), input);
            } else {
                // Use the input directly as the code
                codeToEvaluate = input;
            }

            // Create a function to evaluate the code
            // Using Function constructor instead of eval for better scope isolation
            const evaluateCode = new Function("code", `
                "use strict";
                try {
                    const result = eval(code);
                    // Convert result to string
                    if (result === null) return "null";
                    if (result === undefined) return "undefined";
                    if (typeof result === "object") return JSON.stringify(result, null, 2);
                    return String(result);
                } catch (e) {
                    return "Error: " + e.message;
                }
            `);

            return evaluateCode(codeToEvaluate);

        } catch (err) {
            throw new OperationError("Error evaluating JavaScript: " + err.message);
        }
    }

}

export default JSEvaluate;
