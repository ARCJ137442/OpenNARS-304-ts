//! Java source: opennars/plugin/mental/Emotions.java
import { ReasonerInputError } from "../../runtime/ReasonerErrors.ts";
import type { FloatNumber, IntNumber, DoubleNumber, RuntimeLong } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { Task } from "../../entity/Task.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { BudgetFunctions } from "../../inference/BudgetFunctions.ts";
import { Symbols } from "../../io/Symbols.ts";
import { Inheritance } from "../../language/Inheritance.ts";
import { SetInt } from "../../language/SetInt.ts";
import { Term } from "../../language/Term.ts";
import type { DerivationContext } from "../../control/DerivationContext.ts";
import type { Nar } from "../../main/Nar.ts";
import type { Plugin } from "../Plugin.ts";
import { Float32Math } from "../../runtime/Float32.ts";
import { asText } from "../../runtime/Text.ts";



/**
 * emotional value; self-felt internal mental states; variables used to record
 * emotional values
 */
// Java source declares a plain Plugin implementation without a JavaObject base.
// Keep jree for translated event/exception/string/Math contracts; this class's
// identity is already provided by the native TypeScript class itself.
export class Emotions implements Plugin {

    public HAPPY_EVENT_HIGHER_THRESHOLD: FloatNumber = Float32Math.from(0.75) as FloatNumber;
    public HAPPY_EVENT_LOWER_THRESHOLD: FloatNumber = Float32Math.from(0.25) as FloatNumber;
    public BUSY_EVENT_HIGHER_THRESHOLD: FloatNumber = Float32Math.from(0.9) as FloatNumber; // 1.6.4, step by step^, there is already enough new
    // things ^^
    public BUSY_EVENT_LOWER_THRESHOLD: FloatNumber = Float32Math.from(0.1) as FloatNumber;
    public CHANGE_STEPS_DEMANDED: IntNumber = 1000;

    public lasthappy: DoubleNumber = 0.5;
    public last_happy_time: RuntimeLong = 0 as unknown as RuntimeLong;
    public last_busy_time: RuntimeLong = 0 as unknown as RuntimeLong;

    /**
     * Java permits a private field and an accessor method to share a name.
     * Keep the public method names while avoiding a TypeScript instance field
     * shadowing happy() and busy().
     */
    private happyValue: FloatNumber = Float32Math.from(0) as FloatNumber;
    private busyValue: FloatNumber = Float32Math.from(0) as FloatNumber;

    public setHAPPY_EVENT_HIGHER_THRESHOLD(val: DoubleNumber): void {
        this.HAPPY_EVENT_HIGHER_THRESHOLD = Float32Math.from(val) as FloatNumber;
    }

    public getHAPPY_EVENT_HIGHER_THRESHOLD(): DoubleNumber {
        return this.HAPPY_EVENT_HIGHER_THRESHOLD;
    }

    public setHAPPY_EVENT_LOWER_THRESHOLD(val: DoubleNumber): void {
        this.HAPPY_EVENT_LOWER_THRESHOLD = Float32Math.from(val) as FloatNumber;
    }

    public getHAPPY_EVENT_LOWER_THRESHOLD(): DoubleNumber {
        return this.HAPPY_EVENT_LOWER_THRESHOLD;
    }

    public setBUSY_EVENT_HIGHER_THRESHOLD(val: DoubleNumber): void {
        this.BUSY_EVENT_HIGHER_THRESHOLD = Float32Math.from(val) as FloatNumber;
    }

    public getBUSY_EVENT_HIGHER_THRESHOLD(): DoubleNumber {
        return this.BUSY_EVENT_HIGHER_THRESHOLD;
    }

    public setBUSY_EVENT_LOWER_THRESHOLD(val: DoubleNumber): void {
        this.BUSY_EVENT_LOWER_THRESHOLD = Float32Math.from(val) as FloatNumber;
    }

    public getBUSY_EVENT_LOWER_THRESHOLD(): DoubleNumber {
        return this.BUSY_EVENT_LOWER_THRESHOLD;
    }

    public setCHANGE_STEPS_DEMANDED(val: DoubleNumber): void {
        this.CHANGE_STEPS_DEMANDED = val as IntNumber;
    }

    public getCHANGE_STEPS_DEMANDED(): DoubleNumber {
        return this.CHANGE_STEPS_DEMANDED;
    }

    public resetEmotions(): void {
        this.happyValue = Float32Math.from(0.5) as FloatNumber;
        this.busyValue = Float32Math.from(0.5) as FloatNumber;
        this.lastbusy = 0.5;
        this.lasthappy = 0.5;
    }

    public constructor();

    public constructor(HAPPY_EVENT_LOWER_THRESHOLD: FloatNumber, HAPPY_EVENT_HIGHER_THRESHOLD: FloatNumber,
        BUSY_EVENT_LOWER_THRESHOLD: FloatNumber, BUSY_EVENT_HIGHER_THRESHOLD: FloatNumber, CHANGE_STEPS_DEMANDED: IntNumber);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {
                break;
            }

            case 5: {
                const [HAPPY_EVENT_LOWER_THRESHOLD, HAPPY_EVENT_HIGHER_THRESHOLD, BUSY_EVENT_LOWER_THRESHOLD, BUSY_EVENT_HIGHER_THRESHOLD, CHANGE_STEPS_DEMANDED] = args as [FloatNumber, FloatNumber, FloatNumber, FloatNumber, IntNumber];

                this.BUSY_EVENT_LOWER_THRESHOLD = Float32Math.from(BUSY_EVENT_LOWER_THRESHOLD) as FloatNumber;
                this.BUSY_EVENT_HIGHER_THRESHOLD = Float32Math.from(BUSY_EVENT_HIGHER_THRESHOLD) as FloatNumber;
                this.HAPPY_EVENT_LOWER_THRESHOLD = Float32Math.from(HAPPY_EVENT_LOWER_THRESHOLD) as FloatNumber;
                this.HAPPY_EVENT_HIGHER_THRESHOLD = Float32Math.from(HAPPY_EVENT_HIGHER_THRESHOLD) as FloatNumber;
                this.CHANGE_STEPS_DEMANDED = CHANGE_STEPS_DEMANDED;


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    public set(happy: FloatNumber, busy: FloatNumber): void {
        this.happyValue = Float32Math.from(happy) as FloatNumber;
        this.busyValue = Float32Math.from(busy) as FloatNumber;
    }

    public happy(): FloatNumber {
        return this.happyValue;
    }

    public busy(): FloatNumber {
        return this.busyValue;
    }

    public adjustSatisfaction(newValue: FloatNumber, weight: FloatNumber, nal: DerivationContext): void {

        // FloatNumber oldV = happyValue;
        this.happyValue = Float32Math.add(
            this.happyValue,
            Float32Math.multiply(newValue, weight),
        ) as FloatNumber;
        this.happyValue = Float32Math.divide(
            this.happyValue,
            Float32Math.add(1.0, weight),
        ) as FloatNumber;

        if (!this.enabled) {
            return;
        }

        let frequency: FloatNumber = -1;
        if (Math.abs(this.happyValue - this.lasthappy) > this.CHANGE_THRESHOLD
            && nal.time.time() - this.last_happy_time > this.CHANGE_STEPS_DEMANDED) {
            if (this.happyValue > this.HAPPY_EVENT_HIGHER_THRESHOLD && this.lasthappy <= this.HAPPY_EVENT_HIGHER_THRESHOLD) {
                frequency = 1.0;
            }
            if (this.happyValue < this.HAPPY_EVENT_LOWER_THRESHOLD && this.lasthappy >= this.HAPPY_EVENT_LOWER_THRESHOLD) {
                frequency = 0.0;
            }
            this.lasthappy = this.happyValue;
            this.last_happy_time = nal.time.time();
        }

        if (frequency !== -1) { // ok lets add an event now
            let predicate: Term = SetInt.make(new Term(asText("satisfied")));
            let subject: Term = Term.SELF;
            let inh: Inheritance = Inheritance.make(subject, predicate);
            let truth: TruthValue = TruthValue.fromFrequencyConfidence(this.happyValue, nal.narParameters.DEFAULT_JUDGMENT_CONFIDENCE,
                nal.narParameters);
            let s: Sentence = new Sentence(inh, Symbols.JUDGMENT_MARK, truth, new Stamp(nal.time, nal.memory));
            s.stamp.setOccurrenceTime(nal.time.time());

            let budgetOfNewTask: BudgetValue = new BudgetValue(nal.narParameters.DEFAULT_JUDGMENT_PRIORITY,
                nal.narParameters.DEFAULT_JUDGMENT_DURABILITY,
                BudgetFunctions.truthToQuality(truth),
                nal.narParameters);
            let t: Task = new Task(s, budgetOfNewTask, Task.EnumType.INPUT);

            nal.addTask(t, "emotion");
            /*
             * if(Parameters.REFLECT_META_HAPPY_GOAL) { //remind on the goal whenever
             * happyness changes, should suffice for now
             * TruthValue truth2=TruthValue.fromFrequencyConfidence(1.0f,Parameters.DEFAULT_GOAL_CONFIDENCE);
             * Sentence s2=new Sentence(inh,Symbols.GOAL_MARK,truth2,new Stamp(nal.memory));
             * s2.stamp.setOccurrenceTime(nal.memory.time());
             * Task t2=new Task(s2,new
             * BudgetValue(Parameters.DEFAULT_GOAL_PRIORITY,Parameters.
             * DEFAULT_GOAL_DURABILITY,BudgetFunctions.truthToQuality(truth2)));
             * nal.addTask(t2, "metagoal");
             * //this is a good candidate for innate belief for consider and remind:
             * Operator consider=nal.memory.getOperator("^consider");
             * Operator remind=nal.memory.getOperator("^remind");
             * Term[] arg=new Term[1];
             * arg[0]=inh;
             * if(InternalExperience.enabled && Parameters.CONSIDER_REMIND) {
             * Operation op_consider=Operation.make(consider, arg, true);
             * Operation op_remind=Operation.make(remind, arg, true);
             * Operation[] op=new Operation[2];
             * op[0]=op_remind; //order important because usually reminding something
             * op[1]=op_consider; //means it has good chance to be considered after
             * for(Operation o : op) {
             * TruthValue truth3=new
             * TruthValue(1.0f,Parameters.DEFAULT_JUDGMENT_CONFIDENCE);
             * Sentence s3=new Sentence(o,Symbols.JUDGMENT_MARK,truth3,new
             * Stamp(nal.memory));
             * s3.stamp.setOccurrenceTime(nal.memory.time());
             *
             * //INTERNAL_EXPERIENCE_DURABILITY_MUL
             * BudgetValue budget=new
             * BudgetValue(Parameters.DEFAULT_JUDGMENT_PRIORITY,Parameters.
             * DEFAULT_JUDGMENT_DURABILITY,BudgetFunctions.truthToQuality(truth3));
             * budget.setPriority(budget.getPriority()*InternalExperience.
             * INTERNAL_EXPERIENCE_PRIORITY_MUL);
             * budget.setDurability(budget.getPriority()*InternalExperience.
             * INTERNAL_EXPERIENCE_DURABILITY_MUL);
             * Task t3=new Task(s3,budget);
             * nal.addTask(t3, "internal experience for consider and remind");
             * }
             * }
             * }
             */
        }
        // if (Math.abs(oldV - happyValue) > 0.1) {
        // Record.append("HAPPY: " + (IntNumber) (oldV*10.0) + " to " + (IntNumber)
        // (happyValue*10.0) + "\n");
    }

    public lastbusy: DoubleNumber = 0.5;
    public readonly CHANGE_THRESHOLD: DoubleNumber = 0.25;

    public adjustBusy(newValue: FloatNumber, weight: FloatNumber, nal: DerivationContext): void {

        this.busyValue = Float32Math.add(
            this.busyValue,
            Float32Math.multiply(newValue, weight),
        ) as FloatNumber;
        this.busyValue = Float32Math.divide(
            this.busyValue,
            Float32Math.add(1.0, weight),
        ) as FloatNumber;

        if (!this.enabled) {
            return;
        }

        let frequency: FloatNumber = -1;
        if (Math.abs(this.busyValue - this.lastbusy) > this.CHANGE_THRESHOLD && nal.time.time() - this.last_busy_time > this.CHANGE_STEPS_DEMANDED) {
            if (this.busyValue > this.BUSY_EVENT_HIGHER_THRESHOLD && this.lastbusy <= this.BUSY_EVENT_HIGHER_THRESHOLD) {
                frequency = 1.0;
            }
            if (this.busyValue < this.BUSY_EVENT_LOWER_THRESHOLD && this.lastbusy >= this.BUSY_EVENT_LOWER_THRESHOLD) {
                frequency = 0.0;
            }
            this.lastbusy = this.busyValue;
            this.last_busy_time = nal.time.time();
        }

        if (frequency !== -1) { // ok lets add an event now
            let predicate: Term = SetInt.make(new Term(asText("busy")));
            let subject: Term = new Term(asText("SELF"));
            let inh: Inheritance = Inheritance.make(subject, predicate);
            let truth: TruthValue = TruthValue.fromFrequencyConfidence(this.busyValue, nal.narParameters.DEFAULT_JUDGMENT_CONFIDENCE,
                nal.narParameters);
            let s: Sentence = new Sentence(
                inh,
                Symbols.JUDGMENT_MARK,
                truth,
                new Stamp(nal.time, nal.memory));
            s.stamp.setOccurrenceTime(nal.time.time());

            let budgetForNewTask: BudgetValue = new BudgetValue(nal.narParameters.DEFAULT_JUDGMENT_PRIORITY,
                nal.narParameters.DEFAULT_JUDGMENT_DURABILITY,
                BudgetFunctions.truthToQuality(truth), nal.narParameters);
            let t: Task = new Task(s, budgetForNewTask, Task.EnumType.INPUT);
            nal.addTask(t, "emotion");
        }
    }

    protected enabled: boolean = false; // false means it needs to be retrieved using feelSatisfied / feelBusy instead

    public setEnabled(n: Nar, enabled: boolean): boolean {
        this.enabled = enabled;
        if (this.enabled) {
            this.resetEmotions();
        }
        return enabled;
    }
}
