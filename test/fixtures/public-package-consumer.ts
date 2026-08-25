import {
    BudgetValue,
    Debug,
    Events,
    Nar,
    Narsese,
    Parameters,
    Parser,
    Term,
    TruthValue,
    type EventObserver,
} from "opennars-304-ts";

const nar = new Nar();
const observer: EventObserver = {
    event(event) {
        if (event === Events.CycleEnd.class) {
            nar.time();
        }
    },
};
nar.on(Events.CycleEnd.class, observer);
nar.addInput("<bird --> animal>.");
nar.cycles(1);
nar.off(Events.CycleEnd.class, observer);

const parameters = new Parameters();
const truth = TruthValue.fromFrequencyConfidence(0.7, 0.6, parameters);
const budget = new BudgetValue(0.4, 0.6, truth, parameters);
const term = Term.get("bird");
const narsese = new Narsese(nar);
const parsed = narsese.parseTerm("bird");
const rendered: string = term.toString();
const parserError = new Parser.InvalidInputException("invalid input");

Debug.TEST = false;
void budget.summary();
void parsed;
void rendered;
void parserError;
nar.stop();
