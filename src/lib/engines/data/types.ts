/** Data formats supported by the data engine. */
export type DataFormat = "json" | "yaml" | "csv" | "tsv" | "xml";

/** Human-readable labels. */
export const DATA_FORMAT_LABELS: Record<DataFormat, string> = {
  json: "JSON",
  yaml: "YAML",
  csv: "CSV",
  tsv: "TSV",
  xml: "XML",
};

/** File extension per format (used for downloads). */
export const DATA_FORMAT_EXTENSIONS: Record<DataFormat, string> = {
  json: "json",
  yaml: "yaml",
  csv: "csv",
  tsv: "tsv",
  xml: "xml",
};
