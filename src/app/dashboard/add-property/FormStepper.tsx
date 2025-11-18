"use client";

import { Check } from "lucide-react";

interface Step {
  id: number;
  name: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export function FormStepper({
  steps,
  currentStep,
  setCurrentStep,
}: FormStepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`flex-1 ${
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
            } relative`}
          >
            {step.id < currentStep ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-full hover:bg-primary/90"
                >
                  <Check className="w-5 h-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </button>
              </>
            ) : step.id === currentStep ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <button
                  type="button"
                  className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-primary rounded-full"
                  aria-current="step"
                >
                  <span
                    className="h-2.5 w-2.5 bg-primary rounded-full"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </button>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <button
                  type="button"
                  className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
                >
                  <span
                    className="h-2.5 w-2.5 bg-transparent rounded-full"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </button>
              </>
            )}
            <p className="absolute -bottom-6 text-xs font-medium text-gray-700">
              {step.name}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  );
}
