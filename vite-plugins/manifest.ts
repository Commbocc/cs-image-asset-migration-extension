import { type Plugin } from "vite";
import packageJson from "../package.json" with { type: "json" };
import type { IPackageJson } from "package-json-type";

export function manifestPlugin(
  func: (packageJson: IPackageJson) => ManifestV3,
): Plugin {
  const manifest = func(packageJson as IPackageJson);
  return {
    name: "generate-manifest",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: JSON.stringify(manifest, null, 2),
      });
    },
  };
}

export interface ManifestV3 {
  manifest_version: 3;
  name: string;
  version: string;
  description?: string;
  action?: {
    default_popup?: string;
    default_title?: string;
    default_icon?: string | Record<string, string>;
  };
  background?: {
    service_worker: string;
    type?: "module";
  };
  permissions?: string[];
  host_permissions?: string[];
  content_scripts?: Array<{
    matches: string[];
    js?: string[];
    css?: string[];
    run_at?: "document_start" | "document_end" | "document_idle";
  }>;
  icons?: Record<string, string>;
  key?:string
}
