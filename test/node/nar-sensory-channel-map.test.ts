import assert from "node:assert/strict";
import test from "node:test";
import { java } from "../support/legacy-runtime-facade.ts";

import { Nar } from "../../src/main/Nar.ts";
import { Term } from "../../src/language/Term.ts";
import { NativeMap } from "../../src/runtime/NativeMap.ts";
import { ReasonerObject } from "../../src/runtime/ClassIdentity.ts";
import { SensoryChannel } from "../../src/plugin/perception/SensoryChannel.ts";
import type { Task } from "../../src/entity/Task.ts";
import type { Timable } from "../../src/interfaces/Timable.ts";

class ProbeChannel extends SensoryChannel {
    public constructor(private readonly owner: Nar) {
        super();
        this.nar = owner;
    }

    public addInput(_task: Task, _time: Timable): Nar {
        return this.owner;
    }
}

test("Nar sensory channel registry keeps Java Map and Term equality semantics", () => {
    const nar = new Nar({ configText: "<config></config>" });
    try {
        const first = new ProbeChannel(nar);
        const replacement = new ProbeChannel(nar);
        nar.addSensoryChannel(new java.lang.String("probe"), first);

        const channels = (nar as unknown as {
            sensoryChannels: NativeMap<Term, SensoryChannel>;
        }).sensoryChannels;
        assert.equal(channels instanceof NativeMap, true);
        assert.equal(channels.size(), 1);

        const equivalentTerm = new Term(new java.lang.String("probe"));
        assert.equal(channels.containsKey(equivalentTerm), true);
        assert.equal(channels.get(equivalentTerm), first);
        assert.equal(channels.put(equivalentTerm, replacement), first);
        assert.equal(channels.size(), 1);
        assert.equal(channels.values().toArray()[0], replacement);

        assert.equal(channels.remove(equivalentTerm), replacement);
        assert.equal(channels.isEmpty(), true);
    } finally {
        nar.stop();
    }
});

test("Nar sensory channel consumer accepts a native string boundary", () => {
    const nar = new Nar({ configText: "<config></config>" });
    try {
        const channel = new ProbeChannel(nar);
        nar.addSensoryChannel("native-probe", channel);

        const channels = (nar as unknown as {
            sensoryChannels: NativeMap<Term, SensoryChannel>;
        }).sensoryChannels;
        assert.equal(channels.size(), 1);
        assert.equal(channels.get(new Term(new java.lang.String("native-probe"))), channel);
    } finally {
        nar.stop();
    }
});

test("SensoryChannel keeps the Java plain-base class identity contract", () => {
    assert.equal(Object.getPrototypeOf(SensoryChannel.prototype), ReasonerObject.prototype);

    const nar = new Nar({ configText: "<config></config>" });
    try {
        const channel = new ProbeChannel(nar);
        assert.equal(channel.getClass(), ProbeChannel.class);
    assert.equal(channel.getClass().name, "ProbeChannel");
    } finally {
        nar.stop();
    }
});
