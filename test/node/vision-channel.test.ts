import assert from "node:assert/strict";
import test from "node:test";

test("default NAR registers VisionChannel and maps decimal coordinates", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { VisionChannel } = await import("../../src/plugin/perception/VisionChannel.ts");

    const nar = new Nar();
    const channels = Array.from(nar.sensoryChannels.values());
    const vision = channels.find((channel) => channel instanceof VisionChannel);

    assert.ok(vision);
    assert.equal(vision.width, 5);
    assert.equal(vision.height, 5);
    assert.doesNotThrow(() => {
        nar.addInput(new java.lang.String("<{M1[-1.0,0.0]} --> [BRIGHT]>."));
    });
    assert.equal((vision as any).cnt_updated, 1);
    assert.equal((vision as any).subj, "M1");

    const coordinates = [-1, -0.5, 0, 0.5, 1];
    assert.doesNotThrow(() => {
        for (const y of coordinates) {
            for (const x of coordinates) {
                if (y === -1 && x === 0) continue;
                nar.addInput(new java.lang.String(
                    `<{M1[${y.toFixed(1)},${x.toFixed(1)}]} --> [BRIGHT]>.`,
                ));
            }
        }
    });
    assert.equal((vision as any).cnt_updated, 0);
    assert.equal((vision as any).subj, "");
});
