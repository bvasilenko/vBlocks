// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { SidebarDrawer } from "../demo/src/ui/sidebar-drawer";

const CHILD_TEXT = "panel content";
const children = <span>{CHILD_TEXT}</span>;

describe("SidebarDrawer - accessibility", () => {
  it("aside has aria-label='Variant selector' by default", () => {
    const { getByRole } = render(
      <SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>
    );
    expect(getByRole("complementary", { name: "Variant selector" })).toBeTruthy();
  });

  it("aside reflects a custom label prop in its aria-label", () => {
    const { getByRole } = render(
      <SidebarDrawer open={false} onClose={() => {}} label="Catalog options">{children}</SidebarDrawer>
    );
    expect(getByRole("complementary", { name: "Catalog options" })).toBeTruthy();
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

  it("backdrop disappears when transitioning from open to closed", () => {
    const { container, rerender } = render(
      <SidebarDrawer open={true} onClose={() => {}}>{children}</SidebarDrawer>
    );
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
    rerender(<SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>);
    expect(container.querySelector("[aria-hidden='true']")).toBeNull();
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

  it("clicking children inside the aside does not call onClose", () => {
    const onClose = vi.fn();
    const { getByText } = render(
      <SidebarDrawer open={true} onClose={onClose}>{children}</SidebarDrawer>
    );
    fireEvent.click(getByText(CHILD_TEXT));
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("SidebarDrawer - label display", () => {
  it("renders the default label as visible text in the mobile header", () => {
    const { getByText } = render(
      <SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>
    );
    expect(getByText("Variant selector")).toBeTruthy();
  });

  it("renders a custom label as visible text in the mobile header", () => {
    const { getByText } = render(
      <SidebarDrawer open={false} onClose={() => {}} label="My Panel">{children}</SidebarDrawer>
    );
    expect(getByText("My Panel")).toBeTruthy();
  });

  it("renders the label as visible text when the drawer is open", () => {
    const { getByText } = render(
      <SidebarDrawer open={true} onClose={() => {}} label="Custom label">{children}</SidebarDrawer>
    );
    expect(getByText("Custom label")).toBeTruthy();
  });
});

describe("SidebarDrawer - translation state", () => {
  it("aside carries -translate-x-full when closed", () => {
    const { container } = render(
      <SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>
    );
    const aside = container.querySelector("aside")!;
    expect(aside.classList.contains("-translate-x-full")).toBe(true);
    expect(aside.classList.contains("translate-x-0")).toBe(false);
  });

  it("aside carries translate-x-0 when open", () => {
    const { container } = render(
      <SidebarDrawer open={true} onClose={() => {}}>{children}</SidebarDrawer>
    );
    const aside = container.querySelector("aside")!;
    expect(aside.classList.contains("translate-x-0")).toBe(true);
    expect(aside.classList.contains("-translate-x-full")).toBe(false);
  });

  it("aside swaps from -translate-x-full to translate-x-0 when opened", () => {
    const { container, rerender } = render(
      <SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>
    );
    rerender(<SidebarDrawer open={true} onClose={() => {}}>{children}</SidebarDrawer>);
    const aside = container.querySelector("aside")!;
    expect(aside.classList.contains("translate-x-0")).toBe(true);
    expect(aside.classList.contains("-translate-x-full")).toBe(false);
  });

  it("aside swaps from translate-x-0 to -translate-x-full when closed", () => {
    const { container, rerender } = render(
      <SidebarDrawer open={true} onClose={() => {}}>{children}</SidebarDrawer>
    );
    rerender(<SidebarDrawer open={false} onClose={() => {}}>{children}</SidebarDrawer>);
    const aside = container.querySelector("aside")!;
    expect(aside.classList.contains("-translate-x-full")).toBe(true);
    expect(aside.classList.contains("translate-x-0")).toBe(false);
  });
});
