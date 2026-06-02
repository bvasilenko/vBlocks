// SPDX-License-Identifier: MIT
// Copyright (c) 2026 bvasilenko
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ErrorBanner } from "../demo/src/ui/error-banner";

describe("ErrorBanner - accessibility", () => {
  it("has role=alert so assistive technologies announce the error", () => {
    const { getByRole } = render(<ErrorBanner message="load failed" onDismiss={() => {}} />);
    expect(getByRole("alert")).toBeTruthy();
  });

  it("dismiss button has aria-label for screen reader identification", () => {
    const { getByRole } = render(<ErrorBanner message="err" onDismiss={() => {}} />);
    expect(getByRole("button", { name: "Dismiss error" })).toBeTruthy();
  });

  it("dismiss button type is button, not submit", () => {
    const { getByRole } = render(<ErrorBanner message="err" onDismiss={() => {}} />);
    expect((getByRole("button", { name: "Dismiss error" }) as HTMLButtonElement).type).toBe("button");
  });
});

describe("ErrorBanner - message rendering", () => {
  it("renders the provided message within the alert region", () => {
    const { getByRole } = render(<ErrorBanner message="Connection refused" onDismiss={() => {}} />);
    expect(getByRole("alert").textContent).toContain("Connection refused");
  });

  it("renders a long message without omitting characters", () => {
    const long = "E".repeat(300);
    const { getByRole } = render(<ErrorBanner message={long} onDismiss={() => {}} />);
    expect(getByRole("alert").textContent).toContain(long);
  });

  it("renders a different message when prop changes", () => {
    const { getByRole, rerender } = render(<ErrorBanner message="first" onDismiss={() => {}} />);
    expect(getByRole("alert").textContent).toContain("first");
    rerender(<ErrorBanner message="second" onDismiss={() => {}} />);
    expect(getByRole("alert").textContent).toContain("second");
  });

  it("renders special characters and punctuation verbatim", () => {
    const msg = "HTTP 404: resource <not> found & retry";
    const { getByRole } = render(<ErrorBanner message={msg} onDismiss={() => {}} />);
    expect(getByRole("alert").textContent).toContain("HTTP 404");
    expect(getByRole("alert").textContent).toContain("retry");
  });
});

describe("ErrorBanner - dismiss interaction", () => {
  it("calls onDismiss when the dismiss button is clicked", () => {
    const onDismiss = vi.fn();
    const { getByRole } = render(<ErrorBanner message="err" onDismiss={onDismiss} />);
    fireEvent.click(getByRole("button", { name: "Dismiss error" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss exactly once per click", () => {
    const onDismiss = vi.fn();
    const { getByRole } = render(<ErrorBanner message="err" onDismiss={onDismiss} />);
    fireEvent.click(getByRole("button", { name: "Dismiss error" }));
    fireEvent.click(getByRole("button", { name: "Dismiss error" }));
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });
});
