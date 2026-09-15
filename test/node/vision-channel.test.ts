import assert from "node:assert/strict";
import test from "node:test";

test("default NAR registers VisionChannel and maps decimal coordinates", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { VisionChannel } = await import("../../src/plugin/perception/VisionChannel.ts");

    const nar = new Nar();
    const channels = Array.from((nar as unknown as { sensoryChannels: { values(): Iterable<unknown> } }).sensoryChannels.values());
    const vision = channels.find((channel) => channel instanceof VisionChannel) as InstanceType<typeof VisionChannel> | undefined;

    if (vision === undefined)
        throw new Error("Expected the default NAR vision channel.");
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

    const results = (vision as any).results as unknown;
    assert.equal(Array.isArray(results), true);
    assert.equal(Array.isArray((vision as any).reportResultsTo), true);
    nar.stop();
});

test("VisionChannel keeps prototype order in a native array", async () => {
    const { java } = await import("jree");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { VisionChannel } = await import("../../src/plugin/perception/VisionChannel.ts");

    const nar = new Nar();
    const vision = new VisionChannel(new java.lang.String("probe"), nar, nar, 1, 1, 1, 0.5, 2);

    vision.step_start(nar);

    assert.equal(Array.isArray(vision.prototypes), true);
    assert.equal(vision.prototypes.length, 1);
    assert.equal(vision.prototypes[0].getObservationCount(), 1);
    nar.stop();
});
