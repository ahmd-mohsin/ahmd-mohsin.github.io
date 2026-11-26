"use client";

import { ReactNode } from "react";
import {
  FigTheTest,
  FigTraceToSegments,
  FigPrimitiveLibrary,
  FigPrimitiveAnatomy,
  FigTwoModes,
  FigProcessDistance,
  FigSeedToFinal,
  FigTelecomHeadline,
  FigAllSuites,
  FigLinesPinch,
  FigWhereFromTelecom,
  FigSameBudget,
  FigGranite,
  FigSearchGain,
  FigCost,
} from "@/components/papers/posts/plvr/figures";

/*
 * Write-up of "Program Learning with Verifiable Rewards" (arXiv 2610.19148).
 * Prose rules for this post. Short sentences in active voice (ASD-STE100).
 * No adverbial phrases. No dashes, colons or semicolons in the prose.
 */

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold text-[#8C1515] mt-14 mb-4 tracking-[-0.01em]">{children}</h2>;
}
function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.75] text-neutral-800 mb-5">{children}</p>;
}
function S({ children }: { children: ReactNode }) {
  return <strong className="text-neutral-900 font-semibold">{children}</strong>;
}
function Q({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[13px] text-[#8C1515]">{children}</span>;
}

export default function Plvr() {
  return (
    <div>
      <figure className="mb-12">
        <div className="border border-black/10 bg-white">
          <img src="/og/plvr.png" alt="PLVR overview. Teacher traces become pieces, checked primitives and one program. Telecom accuracy of four models alone and under the program." className="w-full" />
        </div>
        <figcaption className="mt-3 text-xs text-neutral-500 leading-relaxed">
          PLVR in one picture. We cut 539 teacher traces into 3,141 typed pieces. We write 37 checked primitives
          from their clusters, and a search builds one program from them. The chart shows τ² Telecom accuracy for
          four models alone and under that program (Table 2).
        </figcaption>
      </figure>

      <P>
        A small model fails a long tool-use task. What did it miss? Two answers give the same score. The model
        can lack the <S>capability</S> for the task. The model can also lack the <S>procedure</S>. The procedure
        is which record to read first, which check to run before which fix, and when to stop.
      </P>
      <P>
        The two answers need different fixes. A capability gap needs a bigger or better model. A procedure gap
        needs someone to write the procedure down. This post is about the second fix. I want to measure how much
        of the gap between small and large models is procedure. I also want to show how to write that procedure
        down from the traces of an expert model. We call the method <S>Program Learning with Verifiable Rewards
        (PLVR)</S>.
      </P>

      <H2>Two failures that look the same</H2>
      <P>
        Think about a new person at the help desk of a phone company. The new person is smart. The new person does
        not know the order of checks for a phone with no data. A checklist fixes that in one day. A smarter new
        person with no checklist makes the same mistakes. Some failures go away with more intelligence. Other
        failures go away with a checklist.
      </P>
      <P>
        An end-to-end score does not show which failure you have. A score of 47% can come from a weak model with a
        good process. It can also come from a strong model with no process. You need an experiment that holds one
        of the two things fixed.
      </P>

      <H2>One program in front of many models</H2>
      <P>
        Our experiment holds the procedure fixed. We write the procedure as a program. We build the program one
        time, from the traces of a strong teacher model. We put the same program in front of different models, and
        we do not change their weights. The models are three Nemotron models with 30B to 120B total parameters, and
        Granite-4.2-8B.
      </P>
      <P>
        The logic is simple. If the gap between the models is procedure, the program closes it. All the models
        climb to about the same score. If the gap is capability, the program helps a bit and the models stay apart.
        The measurement is the spread between the best and the worst model under the program. Our results show
        both outcomes. The figure below puts them side by side before I explain how the program works.
      </P>
      <FigTheTest />
      <P>
        The next sections show how we turn traces into that program. The idea that I like most is that every step
        is small and every step gets a check.
      </P>

      <H2>Cut the traces into pieces</H2>
      <P>
        We use 553 synthetic tasks in three formats. <S>Retail</S> is multi-turn order changes against a store
        policy. <S>Telecom</S> is troubleshooting of a phone line against a policy checklist. <S>Tool search</S> is
        the choice and the call of the right tool from a large registry. Claude 5 Opus wrote the tasks. Kimi-K3
        solved them as the teacher. We kept the 539 traces that passed the checks of each task. These traces are
        the only demonstrations in the paper. No benchmark task and no near-duplicate of a benchmark task is in the
        training set.
      </P>
      <P>
        We cut each trace into pieces. One piece is one thing that the agent emits. Each piece gets a type, which
        is reason, call, message or question. The 539 traces give 3,141 pieces. We embed the pieces and cluster
        each type with k-means. This gives 35 clusters. No language model takes part in this step.
      </P>
      <FigTraceToSegments />
      <P>
        Why do we cluster? A cluster shows where a repeated operation lives in the traces. Many retail traces check
        that an order is delivered before an exchange. Those reason pieces land near each other. A cluster does not
        say what the operation is. The next step does that.
      </P>

      <H2>Each operation becomes a small checked call</H2>
      <P>
        Claude 5 Opus reads the clusters. It decides which operations the clusters show, and it writes each
        operation as a <S>primitive</S>. The result is 37 primitives in six groups. Each primitive is a narrow
        question, like <Q>Pick the function</Q> or <Q>Is the problem fixed</Q>.
      </P>
      <FigPrimitiveLibrary />
      <P>
        A primitive is one call to a frozen Granite-4.2-8B under its own prompt. It has typed inputs and a JSON
        output schema. It also has a deterministic verifier and a fallback. Nobody tuned the prompts against a
        benchmark.
      </P>
      <P>
        The verifier is the part that makes this work. A small model makes mistakes. A small model that answers
        one narrow question, with a check on every answer, lets few mistakes through. The verifier rejects an
        output that breaks its schema. It rejects a quote that is not word for word in its source. It rejects a
        fact that does not exist and an expression that does not evaluate. A rejected output gets the fallback.
      </P>
      <FigPrimitiveAnatomy />

      <H2>One program with two jobs</H2>
      <P>
        The program has two modes. The <S>planner</S> mode is for troubleshooting and tool search. A base model
        that reasons before it acts writes a plan for itself. Our program writes that plan for the model. The
        program runs its primitives and produces the chain of thought. The student reads it and makes the tool
        calls.
      </P>
      <P>
        The <S>guard</S> mode is for retail. The student proposes each action. The program checks the action
        against the records, the rules and the consent of the user. The program passes the action, repairs it, or
        sends it back to the student.
      </P>
      <FigTwoModes />
      <P>
        The student is the same model with the same weights in both modes. One thing changes. The program writes
        the reasoning of the student, or the program checks the actions of the student.
      </P>

      <H2>A search finds the program</H2>
      <P>
        The program starts from a short seed that we wrote by hand. The seed has one block for each kind of task.
        The telecom block splits the message into requests. It walks the checklist of the policy in order. It
        reads the state before each fix, and it runs the check again until the check passes.
      </P>
      <P>
        Claude Sonnet 4.5 mines a library of 125 executable rules from the same traces. One rule is{" "}
        <Q>read before changing a record</Q>. An A* search edits the seed with these rules and the primitives.
        Each edit inserts, removes or moves a primitive or a rule, or changes a flag. The search keeps only the
        edits that type-check. The search is plain A*, and we do not claim it as a contribution.
      </P>
      <P>
        How does the search know which program is better? It compares the actions of the program with the actions
        of the teacher on the training tasks. A missing action or wrong arguments costs 1.0. An action out of order
        costs 0.5. An extra action costs 0.5. An abnormal end costs 1.0. We divide the sum by the number of expert
        actions and add the end-state checks of the task. No model judges a conversation.
      </P>
      <FigProcessDistance />
      <P>
        The search minimises f = |P| + 100·d. The term |P| counts the rules that are on. A shorter program wins
        when two programs have the same distance. We pick the final program by its pass rate on held-aside
        synthetic tasks.
      </P>
      <P>
        The figure below shows the telecom block after the search. You can read every line. The added rules look
        like the advice that an experienced agent gives to a new person. Read the record before you change it.
        Confirm the problem before you try a fix. Escalate only after an action fails.
      </P>
      <FigSeedToFinal />
      <P>
        The search adds 9.7 points on Retail, 26.0 points on Telecom and 12.6 points on LiveMCPBench over the seed.
        The average goes from 59.7% to 75.8%. We ran the search with Nemotron 3.5 Lightning as the student. The
        program stayed fixed for every other student.
      </P>
      <FigSearchGain />

      <H2>On Telecom the gap is procedure</H2>
      <P>
        Here is the main result. Every Nemotron student scores between 93.3% and 94.4% on τ² Telecom under the
        program. No other method passes 57.9% on any student.
      </P>
      <FigTelecomHeadline />
      <P>
        The next figure is the real version of the test. Each line is one model, alone and under the program. The
        three Nemotron students start 15.0 points apart on Telecom and finish 1.1 points apart. Granite-4.2-8B goes
        from 43.0% to 91.2%. An 8B model under the program lands next to models with up to 120B parameters.
      </P>
      <FigLinesPinch />
      <P>
        Retail tells the same story with a smaller effect. The students start 15.8 points apart and finish 3.5
        points apart. Granite under the program scores 82.5% on Retail. That is within 2.7 points of the Nemotron
        students.
      </P>
      <FigGranite />
      <P>
        My reading is that most of what these models miss on Telecom is procedure. An 8B model can run the
        procedure after someone writes it down. One note of care applies. The Nemotron Telecom cells under the
        program are means over three runs. The other cells are single runs. I treat a difference of a few points as
        noise.
      </P>

      <H2>More tokens do not explain it</H2>
      <P>
        The program uses more tokens than a plain run. A fair question is whether any use of those tokens helps as
        much. Two baselines test this. They spend the same Granite budget without the program. <S>ReAct</S> runs a
        plan, act and reflect loop. <S>Sample-and-judge</S> takes five samples and lets Granite pick one.
      </P>
      <FigSameBudget />
      <P>
        ReAct makes every student worse. Lightning drops from 47.4% to 32.5%. Sample-and-judge lifts Lightning to
        55.3% and drops Super to 46.5%. The program gets to 93% and 94% with the same budget. The compute is the
        same. The structure is the difference.
      </P>
      <P>
        Fine-tuning on the same traces does not close the gap either. SFT moves each student a few points on
        Telecom. The program beats the fine-tune there by 42 to 47 points. GEPA optimises the system prompt of the
        student with no program. Its best Telecom score is 57.9%.
      </P>
      <P>
        My guess is that a few hundred traces are not enough to put a 40-turn procedure into the weights. The
        fine-tune learns the surface of the traces. The program keeps the procedure outside the weights, where
        every step gets a check. The paper does not test this guess.
      </P>

      <H2>Why long tasks gain the most</H2>
      <P>
        Telecom is where the program wins by the largest margin. Telecom is also where the tasks are long. A
        Telecom task runs about 40 turns under the program. A Retail task runs about 9 turns. The program lifts
        Lightning by 47.0 points on Telecom and by 7.1 points on Retail.
      </P>
      <P>
        My intuition is that small errors add up over many turns. One wrong read or one skipped check early in a
        40-turn task can break everything after it. A program that checks every step stops that build-up. Long
        tasks pay that back the most. This fits the pattern in the results. The paper does not test it.
      </P>

      <H2>Where the student still matters</H2>
      <P>
        LiveMCPBench is different. The task is to pick the right tool from a large registry and to bind its
        arguments. The spread between the students goes from 11.6 to 9.4 points. Granite under the program
        scores 42.1%. The Nemotron students under the same program score 3.2 to 12.6 points higher.
      </P>
      <P>
        The program still helps here. It takes Lightning from 42.1% to 50.5%. The choice of tool and the binding
        of arguments stay with the student. That part of the task is capability, and a written procedure does not
        replace it.
      </P>
      <P>
        The program is competitive with the best baseline on Retail and LiveMCPBench, but it does not win
        everywhere. SFT gives Super 86.0% on Retail against 79.8% for the program. Sample-and-judge gives Super
        58.9% on LiveMCPBench against 54.7%.
      </P>
      <FigAllSuites />

      <H2>How much came from the teacher</H2>
      <P>
        A fair worry is that the frontier models did the work. Claude 5 Opus wrote the primitives and Claude Sonnet
        4.5 mined the rules. Neither model is a blank slate about customer service. We ran an ablation to check
        this. Sonnet 4.5 proposes the program from its own knowledge, with no traces and no primitives. It starts
        from the same seed. The tasks score its programs by outcome.
      </P>
      <FigWhereFromTelecom />
      <P>
        The model alone scores 47.4% on Telecom. The seed that we wrote by hand takes it to 68.4%. Edits from
        Sonnet with no traces take it to 75.4%. The program from the traces takes it to 94.4%.
      </P>
      <P>
        I read this in two ways. A large part of what the student lacks is procedure that a person can write down.
        The seed alone is worth 21 points. The last 19 points come only from the actions of the teacher. Neither we
        nor the frontier model wrote that part down without the traces.
      </P>
      <P>
        The program also carries the prior knowledge of the frontier models. Our estimate of the procedure share is
        an upper bound for that reason.
      </P>

      <H2>What it costs</H2>
      <P>
        The program is not free at inference time. The student reads 3.3 to 5.4 times as many input tokens. Granite
        makes 100 to 117 primitive calls per task. A run under the program costs 4.7 to 9.8 times the FLOPs of a
        plain run.
      </P>
      <P>
        The build cost is a one-time cost. The search cost 3.0×10¹⁹ FLOPs one time for all students. One
        fine-tuning run costs 7.7×10¹⁷ to 3.1×10¹⁸ FLOPs. The sweep that picks that run costs 1.6×10¹⁹ to
        6.4×10¹⁹ FLOPs for each student. All students share one program. Each student needs its own fine-tune.
        The rule mining took 16 calls to Sonnet 4.5.
      </P>
      <FigCost />
      <P>
        The trade is simple. You pay more at inference time, and you get a more reliable agent. You also get an
        artifact that you can read.
      </P>

      <H2>What I take from this</H2>
      <P>
        The output of PLVR is a program and not a checkpoint. That has three effects. You can read the program at
        every step. The same program works for every base model. You can fix the program one primitive at a time.
      </P>
      <P>
        The result has limits. It is in-domain. We built the program from synthetic tasks in the environment of
        each benchmark. We ran it on the unseen test tasks of the same benchmark. It says nothing yet about transfer to
        a new domain. The method also needs steps that a verifier can check. Open-ended writing is outside its
        scope.
      </P>
      <P>
        The open question that I find most interesting is transfer. Does a program that we build in one
        environment work in another? If procedure is a large part of the gap, a library of procedures can matter as
        much as a bigger model. That is the next test.
      </P>

      <div className="mt-14 border-t border-black/10 pt-6 text-[13px] text-neutral-600 leading-relaxed">
        <p>
          The paper is joint work with Vishvesh Bhat (CoreThink AI) and Asad Aali (Stanford University).
        </p>
        <p className="mt-2">
          <a
            href="https://arxiv.org/abs/2610.19148"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8C1515] underline underline-offset-2"
          >
            Read the paper on arXiv
          </a>
        </p>
      </div>
    </div>
  );
}
