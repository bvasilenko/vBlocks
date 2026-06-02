// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { SidebarDrawer } from "../demo/src/ui/sidebar-drawer";

const CHILD_TEXT = "panel content";
const children = <span>{CHILD_TEXT}</span>;

describe("SidebarDrawer - accessibility", () => {
  it("aside has aria-label='Variant selector'", () => {
    const { getByRole } = render(
      <SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>
    );
    expect(getByRole("complementary", { name: "Variant selector" })).toBeTruthy();
  });
});

describe("SidebarDrawer - children rendering", () => {
  it("renders children when closed", () => {
    const { getByText } = render(
      <SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>
    );
    expect(getByText(CHILD_TEXT)).toBeTruthy();
  });

  it("renders children when open", () => {
    const { getByText } = render(
      <SidebarDrawer open={true} onClose={() => {}}>{children}</SidebarDrawer>
    );
    expect(getByText(CHILD_TEXT)).toBeTruthy();
  });

  it("children remain in DOM when transitioning from open to closed", () => {
    const { getByText, rerender } = render(
      <SidebarDrawer open={true} onClose={() => {}}>{children}</SidebarDrawer>
    );
    rerender(<SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>);
    expect(getByText(CHILD_TEXT)).toBeTruthy();
  });
});

describe("SidebarDrawer - backdrop presence", () => {
  it("backdrop is present in the DOM when open=true", () => {
    const { container } = render(
      <SidebarDrawer open={true} onClose={() => {}}>{children}</SidebarDrawer>
    );
    const backdrop = container.querySelector("[aria-hidden='true']");
    expect(backdrop).not.toBeNull();
  });

  it("backdrop is absent from the DOM when open=false", () => {
    const { container } = render(
      <SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>
    );
    const backdrop = container.querySelector("[aria-hidden='true']");
    expect(backdrop).toBeNull();
  });

  it("backdrop appears when transitioning from closed to open", () => {
    const { container, rerender } = render(
      <SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>
    );
    expect(container.querySelector("[aria-hidden='true']")).toBeNull();
    rerender(<SidebarDrawer open={true} onClose={() => {}}>{children}</SidebarDrawer>);
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });
});

describe("SidebarDrawer - close interactions", () => {
  it("clicking the backdrop calls onClose", () => {
    const onClose = vi.fn();
    const { container } = render(
      <SidebarDrawer open={true} onClose={onClose}>{children}</SidebarDrawer>
    );
    const backdrop = container.querySelector("[aria-hidden='true']") as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Close button inside the drawer calls onClose", () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <SidebarDrawer open={true} onClose={onClose}>{children}</SidebarDrawer>
    );
    fireEvent.click(getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Close button type is button, not submit", () => {
    const { getByRole } = render(
      <SidebarDrawer open={true} onClose={() => {}}>{children}</SidebarDrawer>
    );
    expect((getByRole("button", { name: "Close" }) as HTMLButtonElement).type).toBe("button");
  });
});
