import React, { useRef, useEffect, useState, MutableRefObject } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger
} from "@/components/ui/dialog";
import { TranslationResponse } from "@/types/translation-response";
import { Textarea } from './ui/textarea';
import { Toggle } from "./ui/toggle";

export function EditTranslationDialog(
    { translation, children, isOpen, onClose }:
        { translation: TranslationResponse, children: JSX.Element, isOpen: boolean, onClose: () => void }
) {
    const [activeToggles, setActiveToggles] = useState(
        new Array(translation.translations.length).fill(false)
    );
    const [text, setText] = useState('');

    const dialogRef = useRef<HTMLDivElement | null>(null)
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        const handleKeyDown = ({ ctrlKey, key, target }: KeyboardEvent) => {
            if (ctrlKey && key === "Enter") {
                onClose();
                return;
            }

            const index = Number(key) - 1;
            if (["1", "2", "3", "4"].includes(key) && index < translation.translations.length) {
                if (target === textAreaRef.current) return
                const updatedToggles = [...activeToggles];
                updatedToggles[index] = !updatedToggles[index];
                setActiveToggles(updatedToggles);
            }
        };

        dialogRef.current?.addEventListener("keydown", handleKeyDown);

        return () => {
            dialogRef.current?.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeToggles, translation.translations.length]);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.currentTarget.value);
    };

    return (
        <div ref={dialogRef}>
            <Dialog open={isOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] md:w-full min-w-fit">
                    <DialogHeader className="items-center justify-center">
                        <h1 className="text-2xl font-bold">
                            {translation.text}
                        </h1>
                        <DialogDescription>
                            Choose correct translations
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-4 flex-wrap flex-col items-center justify-center">
                        <div className="flex flex-wrap gap-2 w-full justify-center">
                            {
                                translation.translations.map((t, i) => (
                                    <div key={i} className="relative group md:w-1/3 w-full">
                                        <Toggle variant="outline" className="p-8 w-full" pressed={activeToggles[i]}
                                            onClick={() => {
                                                const updatedToggles = [...activeToggles];
                                                updatedToggles[i] = !updatedToggles[i];
                                                setActiveToggles(updatedToggles);
                                            }}
                                        >
                                            {t}
                                        </Toggle>
                                        <kbd className="rounded-sm border border-gray-500 bg-muted px-1 text-xs uppercase absolute bottom-2 right-2 opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            {i + 1}
                                        </kbd>
                                    </div>
                                ))
                            }
                        </div>
                        <DialogDescription>
                            Or suggest your own
                        </DialogDescription>
                        <Textarea value={text} onChange={handleTextChange} ref={textAreaRef} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={onClose}>
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
