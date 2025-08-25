
/**
 * Term hierarchy in Narsese
 *
 * Open-NARS implements the following formal language, Narsese.
 *
 * <pre>
 *            <sentence> ::= <judgment>
 *                         | <question>
 *            <judgment> ::= <statement> <truth-value>
 *            <question> ::= <statement>
 *           <statement> ::= <<term> <relation> <term>>
 *                         | <compound-statement>
 *                         | <term>
 *                <term> ::= <word>
 *                         | <variable>
 *                         | <compound-term>
 *                         | <statement>
 *            <relation> ::= -->    // Inheritance
 *                         | <->    // Similarity
 *                         | {--    // Instance
 *                         | --]    // Property
 *                         | {-]    // InstanceProperty
 *                         | ==>    // Implication
 *                         | <=>    // Equivalence
 *  <compound-statement> ::= (-- <statement>)                 // Negation
 *                         | (|| <statement> <statement>+)    // Disjunction
 *                         | (&& <statement> <statement>+)    // Conjunction
 *       <compound-term> ::= {<term>+}    // SetExt
 *                         | [<term>+]    // SetInt
 *                         | (& <term> <term>+)    // IntersectionExt
 *                         | (| <term> <term>+)    // IntersectionInt
 *                         | (- <term> <term>)     // DifferenceExt
 *                         | (~ <term> <term>)     // DifferenceInt
 *                         | (* <term> <term>+)    // Product
 *                         | (/ <term>+ _ <term>*)    // ImageExt
 *                         | (\ <term>+ _ <term>*)    // ImageInt
 *            <variable> ::= <independent-var>
 *                         | <dependent-var>
 *                         | <query-var>
 *     <independent-var> ::= $[<word>]
 *       <dependent-var> ::= #<word>
 *           <query-var> ::= ?[<word>]
 *                <word> : string in an alphabet
 *         <truth-value> : a pair of real numbers in [0, 1] x (0, 1)
 * </pre>
 *
 * <p>
 * Major methods in the Term classes:
 * </p>
 *
 * <ul>
 * <li>constructors</li>
 * <li>get and set</li>
 * <li>clone, compare, and unify</li>
 * <li>create and access corresponding concept</li>
 * <li>structural operation in compound</li>
 * </ul>
 */

import { java } from "jree";


