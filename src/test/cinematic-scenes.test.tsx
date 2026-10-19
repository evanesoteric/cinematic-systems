import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LoadingApplet, type AppletName } from "@/components/cipher-applet";

afterEach(cleanup);

describe("cinematic scenes", () => {
  it.each([
    ["decrypt", "The block vault", "FILE RESTORED"],
    ["hash", "Find the fingerprint.", "MATCH FOUND"],
    ["bruteforce", "No way in. Yet.", "ACCESS GRANTED"],
    ["crypto", "Ghost chain", "CONSENSUS REACHED"],
    ["memory", "Volatile evidence", "EVIDENCE RECOVERED"],
    ["intrusion", "Inside the perimeter", "TARGET REACHED"],
    ["mitm", "Between the lines", "SESSION CAPTURED"],
    ["wallet", "Follow the money", "DESTINATION IDENTIFIED"],
    ["wipe", "Leave no trace", "MEDIA SANITIZED"],
    ["triangulation", "Somewhere in the static", "LOCATION LOCKED"],
    ["firewall", "Beyond the barrier", "PERIMETER OPEN"],
  ])("%s has a distinct scene and completes its sequence", (name, title, completed) => {
    const applet = name as AppletName;
    const { rerender } = render(
      <LoadingApplet applet={applet} progress={0} code="X7#K9@2F" running />,
    );
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    rerender(<LoadingApplet applet={applet} progress={100} code="X7#K9@2F" running />);
    expect(screen.getByRole("heading", { name: completed })).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it.each([
    "memory",
    "intrusion",
    "mitm",
    "wallet",
    "wipe",
    "triangulation",
    "firewall",
  ] as AppletName[])("%s holds motion while paused", (applet) => {
    const { container } = render(
      <LoadingApplet applet={applet} progress={50} code="X7#K9@2F" running={false} />,
    );
    expect(container.querySelector(".cinema-scene")).toHaveAttribute("data-active", "false");
    expect(screen.getByText("HOLD")).toBeInTheDocument();
  });

  it("freezes scene motion while paused and resolves password characters progressively", () => {
    const { container } = render(
      <LoadingApplet applet="bruteforce" progress={50} code="X7#K9@2F" running={false} />,
    );
    expect(container.querySelector(".cinema-scene")).toHaveAttribute("data-active", "false");
    expect(container.querySelectorAll(".password-display .locked")).toHaveLength(4);
    expect(screen.getByText("HOLD")).toBeInTheDocument();
  });
});

describe("expanded scene progression", () => {
  it("erases sectors progressively and restores them when restarted", () => {
    const { container, rerender } = render(
      <LoadingApplet applet="wipe" progress={50} code="X7#K9@2F" running />,
    );
    expect(container.querySelectorAll(".wipe-grid .erased")).toHaveLength(80);
    rerender(<LoadingApplet applet="wipe" progress={100} code="X7#K9@2F" running />);
    expect(container.querySelectorAll(".wipe-grid .erased")).toHaveLength(160);
    expect(container.querySelector(".cinema-scene")).toHaveAttribute("data-active", "false");
    rerender(<LoadingApplet applet="wipe" progress={0} code="X7#K9@2F" running />);
    expect(container.querySelectorAll(".wipe-grid .erased")).toHaveLength(0);
  });

  it("opens firewall layers in sequence", () => {
    const { container, rerender } = render(
      <LoadingApplet applet="firewall" progress={40} code="X7#K9@2F" running />,
    );
    expect(container.querySelectorAll(".firewall-layer.breached")).toHaveLength(2);
    rerender(<LoadingApplet applet="firewall" progress={100} code="X7#K9@2F" running />);
    expect(container.querySelectorAll(".firewall-layer.breached")).toHaveLength(5);
  });

  it("narrows the triangulation uncertainty as the fix resolves", () => {
    const { container, rerender } = render(
      <LoadingApplet applet="triangulation" progress={0} code="X7#K9@2F" running />,
    );
    expect(container.querySelector(".location-lock")).toHaveAttribute("r", "90");
    rerender(<LoadingApplet applet="triangulation" progress={100} code="X7#K9@2F" running />);
    expect(container.querySelector(".location-lock")).toHaveAttribute("r", "8");
    expect(screen.getByText("3 / 3 BEARINGS LOCKED")).toBeInTheDocument();
  });
});
