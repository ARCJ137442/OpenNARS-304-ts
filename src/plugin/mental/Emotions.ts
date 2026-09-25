//! Java source: opennars/plugin/mental/Emotions.java
import { JavaIllegalArgumentException } from "../../runtime/JavaExceptions.ts";
import type { float, int, double, long } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
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
import { toJavaString } from "../../runtime/jree-compat.ts";



/**
 * emotional value; self-felt internal mental states; variables used to record
 * emotional values
 */
// Java source declares a plain Plugin implementation without a JavaObject base.
// Keep jree for translated event/exception/string/Math contracts; this class's
// identity is already provided by the native TypeScript class itself.
export class Emotions implements Plugin {

    public HAPPY_EVENT_HIGHER_THRESHOLD: float = Float32Math.from(0.75) as float;
    public HAPPY_EVENT_LOWER_THRESHOLD: float = Float32Math.from(0.25) as float;
    public BUSY_EVENT_HIGHER_THRESHOLD: float = Float32Math.from(0.9) as float; // 1.6.4, step by step^, there is already enough new
    // things ^^
    public BUSY_EVENT_LOWER_THRESHOLD: float = Float32Math.from(0.1) as float;
    public CHANGE_STEPS_DEMANDED: int = 1000;

    public lasthappy: double = 0.5;
    public last_happy_time: long = 0 as unknown as long;
    public last_busy_time: long = 0 as unknown as long;

    /**
     * Java permits a private field and an accessor method to share a name.
     * Keep the public method names while avoiding a TypeScript instance field
     * shadowing happy() and busy().
     */
    private happyValue: float = Float32Math.from(0) as float;
    private busyValue: float = Float32Math.from(0) as float;

    public setHAPPY_EVENT_HIGHER_THRESHOLD(val: double): void {
        this.HAPPY_EVENT_HIGHER_THRESHOLD = Float32Math.from(val) as float;
    }

    public getHAPPY_EVENT_HIGHER_THRESHOLD(): double {
        return this.HAPPY_EVENT_HIGHER_THRESHOLD;
    }

    public setHAPPY_EVENT_LOWER_THRESHOLD(val: double): void {
        this.HAPPY_EVENT_LOWER_THRESHOLD = Float32Math.from(val) as float;
    }

    public getHAPPY_EVENT_LOWER_THRESHOLD(): double {
        return this.HAPPY_EVENT_LOWER_THRESHOLD;
    }

    public setBUSY_EVENT_HIGHER_THRESHOLD(val: double): void {
        this.BUSY_EVENT_HIGHER_THRESHOLD = Float32Math.from(val) as float;
    }

    public getBUSY_EVENT_HIGHER_THRESHOLD(): double {
        return this.BUSY_EVENT_HIGHER_THRESHOLD;
    }

    public setBUSY_EVENT_LOWER_THRESHOLD(val: double): void {
        this.BUSY_EVENT_LOWER_THRESHOLD = Float32Math.from(val) as float;
    }

    public getBUSY_EVENT_LOWER_THRESHOLD(): double {
        return this.BUSY_EVENT_LOWER_THRESHOLD;
    }

    public setCHANGE_STEPS_DEMANDED(val: double): void {
        this.CHANGE_STEPS_DEMANDED = val as int;
    }

    public getCHANGE_STEPS_DEMANDED(): double {
        return this.CHANGE_STEPS_DEMANDED;
    }

    public resetEmotions(): void {
        this.happyValue = Float32Math.from(0.5) as float;
        this.busyValue = Float32Math.from(0.5) as float;
        this.lastbusy = 0.5;
        this.lasthappy = 0.5;
    }

    public constructor();

    public constructor(HAPPY_EVENT_LOWER_THRESHOLD: float, HAPPY_EVENT_HIGHER_THRESHOLD: float,
        BUSY_EVENT_LOWER_THRESHOLD: float, BUSY_EVENT_HIGHER_THRESHOLD: float, CHANGE_STEPS_DEMANDED: int);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {
                break;
            }

            case 5: {
                const [HAPPY_EVENT_LOWER_THRESHOLD, HAPPY_EVENT_HIGHER_THRESHOLD, BUSY_EVENT_LOWER_THRESHOLD, BUSY_EVENT_HIGHER_THRESHOLD, CHANGE_STEPS_DEMANDED] = args as [float, float, float, float, int];

                this.BUSY_EVENT_LOWER_THRESHOLD = Float32Math.from(BUSY_EVENT_LOWER_THRESHOLD) as float;
                this.BUSY_EVENT_HIGHER_THRESHOLD = Float32Math.from(BUSY_EVENT_HIGHER_THRESHOLD) as float;
                this.HAPPY_EVENT_LOWER_THRESHOLD = Float32Math.from(HAPPY_EVENT_LOWER_THRESHOLD) as float;
                this.HAPPY_EVENT_HIGHER_THRESHOLD = Float32Math.from(HAPPY_EVENT_HIGHER_THRESHOLD) as float;
                this.CHANGE_STEPS_DEMANDED = CHANGE_STEPS_DEMANDED;


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    public set(happy: float, busy: float): void {
        this.happyValue = Float32Math.from(happy) as float;
        this.busyValue = Float32Math.from(busy) as float;
    }

    public happy(): float {
        return this.happyValue;
    }

    public busy(): float {
        return this.busyValue;
    }

    public adjustSatisfaction(newValue: float, weight: float, nal: DerivationContext): void {

        // float oldV = happyValue;
        this.happyValue = Float32Math.add(
            this.happyValue,
            Float32Math.multiply(newValue, weight),
        ) as float;
        this.happyValue = Float32Math.divide(
            this.happyValue,
            Float32Math.add(1.0, weight),
        ) as float;

        if (!this.enabled) {
            return;
        }

        let frequency: float = -1;
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
            let predicate: Term = SetInt.make(new Term(toJavaString("satisfied")));
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
        // Record.append("HAPPY: " + (int) (oldV*10.0) + " to " + (int)
        // (happyValue*10.0) + "\n");
    }

    public lastbusy: double = 0.5;
    public readonly CHANGE_THRESHOLD: double = 0.25;

    public adjustBusy(newValue: float, weight: float, nal: DerivationContext): void {

        this.busyValue = Float32Math.add(
            this.busyValue,
            Float32Math.multiply(newValue, weight),
        ) as float;
        this.busyValue = Float32Math.divide(
            this.busyValue,
            Float32Math.add(1.0, weight),
        ) as float;

        if (!this.enabled) {
            return;
        }

        let frequency: float = -1;
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
            let predicate: Term = SetInt.make(new Term(toJavaString("busy")));
            let subject: Term = new Term(toJavaString("SELF"));
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
