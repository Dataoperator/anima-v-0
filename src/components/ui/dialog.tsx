import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
}

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogPrimitive.DialogOverlayProps>(
    ({ className, ...props }, ref) => (
        <DialogPrimitive.Overlay
            ref={ref}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            {...props}
        />
    )
);
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
    ({ children, className, ...props }, ref) => (
        <DialogPrimitive.Content
            ref={ref}
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:bg-gray-900"
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    )
);
DialogContent.displayName = "DialogContent";

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
    ({ children, ...props }, ref) => (
        <DialogPrimitive.Root {...props}>
            <DialogOverlay />
            <DialogContent ref={ref}>{children}</DialogContent>
        </DialogPrimitive.Root>
    )
);
Dialog.displayName = "Dialog";

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className="flex flex-col space-y-1.5 text-center sm:text-left"
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className="text-lg font-semibold leading-none tracking-tight"
        {...props}
    />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className="text-sm text-muted-foreground"
        {...props}
    />
));
DialogDescription.displayName = "DialogDescription";

Dialog.Header = DialogHeader;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Content = DialogContent;

export { Dialog };