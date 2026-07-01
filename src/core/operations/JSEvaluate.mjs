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
        this.description = "Executes (evaluates) JavaScript code and returns the result as a string. The input should be valid JavaScript code that returns a value when executed.";
        this.infoURL = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        try {
            // Create a function to evaluate the code
            // Using Function constructor instead of eval for better scope isolation
            const evaluateCode = new Function("input", `
                "use strict";
                try {
                    const result = eval(input);
                    // Convert result to string
                    if (result === null) return "null";
                    if (result === undefined) return "undefined";
                    if (typeof result === "object") return JSON.stringify(result, null, 2);
                    return String(result);
                } catch (e) {
                    return "Error: " + e.message;
                }
            `);

            return evaluateCode(input);

        } catch (err) {
            throw new OperationError("Error evaluating JavaScript: " + err.message);
        }
    }

}

export default JSEvaluate;
