import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { ExtendedFaqEntry } from "@/types/component.types";

export const FaqItem = ({ q, a, value }: ExtendedFaqEntry) => {
    return (
        <AccordionItem value={value} className="border-gray-200">
            <AccordionTrigger className="hover:no-underline hover:text-amber-500 text-gray-900 text-[17px] font-semibold py-5">
                {q}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed text-base pt-0 pb-6 pr-8">
                {a}
            </AccordionContent>
        </AccordionItem>
    );
};
