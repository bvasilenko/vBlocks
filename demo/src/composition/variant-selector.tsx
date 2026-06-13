import { useEffect } from "react";
import { CompositionEditor, compositionFromHash } from "@booga/vbrand/composition";
import type { CompositionSpec } from "@booga/vbrand/composition";
import { writeCompositionHash } from "../routing/composition-hash";

interface VariantSelectorProps {
  spec: CompositionSpec;
  defaultSpec: CompositionSpec;
  onChange: (spec: CompositionSpec) => void;
}

export function VariantSelector({ spec, defaultSpec, onChange }: VariantSelectorProps) {
  useEffect(() => {
    const loaded = compositionFromHash(window.location.hash.slice(1));
    if (loaded) onChange(loaded);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    writeCompositionHash(spec);
  }, [spec]);

  return (
    <CompositionEditor
      spec={spec}
      onChange={onChange}
      onReset={() => onChange(defaultSpec)}
    />
  );
}
