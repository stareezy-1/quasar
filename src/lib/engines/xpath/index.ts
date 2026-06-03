/**
 * XPath tester — evaluates an XPath 1.0 expression against an XML document
 * using the browser's native XPathEvaluator (available in all modern browsers).
 */

import { type EngineResult, ok, err } from "@/types/engines";

export interface XPathResult {
  type: "string" | "number" | "boolean" | "nodes";
  value: string;
  nodes: string[];
}

export function testXPath(
  xmlInput: string,
  expression: string,
): EngineResult<XPathResult> {
  if (!xmlInput.trim()) return err("Enter XML input.");
  if (!expression.trim()) return err("Enter an XPath expression.");

  if (typeof window === "undefined" || !window.DOMParser) {
    return err("XPath requires a browser environment.");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlInput, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    return err(
      `XML parse error: ${parseError.textContent?.trim() ?? "invalid XML"}`,
    );
  }

  try {
    const evaluator = new XPathEvaluator();
    const result = evaluator.evaluate(
      expression,
      doc,
      null,
      XPathResult.ANY_TYPE,
      null,
    );

    switch (result.resultType) {
      case XPathResult.STRING_TYPE:
        return ok({ type: "string", value: result.stringValue, nodes: [] });
      case XPathResult.NUMBER_TYPE:
        return ok({
          type: "number",
          value: String(result.numberValue),
          nodes: [],
        });
      case XPathResult.BOOLEAN_TYPE:
        return ok({
          type: "boolean",
          value: String(result.booleanValue),
          nodes: [],
        });
      default: {
        const nodes: string[] = [];
        let node: Node | null;
        while ((node = result.iterateNext()) !== null) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            nodes.push(new XMLSerializer().serializeToString(node));
          } else {
            nodes.push(node.nodeValue ?? "");
          }
        }
        return ok({ type: "nodes", value: `${nodes.length} node(s)`, nodes });
      }
    }
  } catch (e) {
    return err(e instanceof Error ? e.message : "XPath evaluation failed.");
  }
}
