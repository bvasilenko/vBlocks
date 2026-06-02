// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ModeChip } from "../demo/src/ui/mode-chip";

describe("ModeChip - element contract", () => {
  it("renders a button element", () => {
    const { getByRole } = render(<ModeChip active={false} onClick={() => {}}>catalog</ModeChip>);
    expect(getByRole("button").tagName.toLowerCase()).toBe("button");
  });

  it("button type is button, not submit", () => {
    const { getByRole } = render(<ModeChip active={false} onClick={() => {}}>catalog</ModeChip>);
    expect((getByRole("button") as HTMLButtonElement).type).toBe("button");
  });

  it("renders children as the visible button label", () => {
    const { getByRole } = render(<ModeChip active={false} onClick={() => {}}>app-template</ModeChip>);
    expect(getByRole("button").textContent).toBe("app-template");
  });
});

describe("ModeChip - aria-pressed state", () => {
  it("aria-pressed is true when active=true", () => {
    const { getByRole } = render(<ModeChip active={true} onClick={() => {}}>canvas</ModeChip>);
    expect(getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });

  it("aria-pressed is false when active=false", () => {
    const { getByRole } = render(<ModeChip active={false} onClick={() => {}}>canvas</ModeChip>);
    expect(getByRole("button").getAttribute("aria-pressed")).toBe("false");
  });

  it("aria-pressed updates when active prop changes", () => {
    const { getByRole, rerender } = render(<ModeChip active={false} onClick={() => {}}>canvas</ModeChip>);
    expect(getByRole("button").getAttribute("aria-pressed")).toBe("false");
    rerender(<ModeChip active={true} onClick={() => {}}>canvas</ModeChip>);
    expect(getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });
});

describe("ModeChip - click interaction", () => {
  it("calls onClick exactly once when clicked", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<ModeChip active={false} onClick={onClick}>catalog</ModeChip>);
    fireEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when active=true (active chips remain clickable)", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<ModeChip active={true} onClick={onClick}>catalog</ModeChip>);
    fireEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick for multiple successive clicks", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<ModeChip active={false} onClick={onClick}>catalog</ModeChip>);
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("button"));
    fireEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(3);
  });
});
