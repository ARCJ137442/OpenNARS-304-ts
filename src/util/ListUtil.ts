//! Java source: opennars/util/ListUtil.java
//! 🚩【2026-01-12 09:31:41】废弃：实际代码并不会调用该处逻辑，且此内包含的逻辑在TypeScript标准库内就可实现

// import { java, JavaObject } from "jree";

// export class ListUtil extends JavaObject {
//     /**
//      * tries to select the first element where the predicate matches from front
//      * (index 0) to the end of the list
//      *
//      * @param candidates the candidates from which the method may select the first
//      *                   one
//      * @param predicate  the checked predicate for each element
//      * @param <T>        generic type
//      * @return element which matched first, null if none matched
//      */
//     public static findAny<T>(candidates: java.util.List<T>, predicate: java.util.function.Predicate<T>): T {
//         for (let i of candidates) {
//             if (predicate.test(i)) {
//                 return i;
//             }
//         }

//         return null;
//     }
// }
