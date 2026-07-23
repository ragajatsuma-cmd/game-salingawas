"use client";

import { X } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  danger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-[rgb(15_39_28/58%)] backdrop-blur-[5px]"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className="w-full max-w-md rounded-3xl border-2 border-[#5d4037] bg-[#f9f7f2] p-7 shadow-[0_24px_80px_rgb(0_0_0/36%)]">
        <h2 id="confirm-title" className="text-lg font-black text-[#214b35]">{title}</h2>
        <p id="confirm-desc" className="mt-3 text-sm leading-7 text-[#5d6d63]">{message}</p>
        <div className="mt-6 flex gap-3">
          <button className="button-secondary flex-1" onClick={onCancel}>{cancelLabel}</button>
          <button
            className={`flex-1 min-h-[46px] rounded-[999px] px-4 text-white font-[800] border-0 ${
              danger
                ? "bg-[#d94f44] shadow-[0_5px_0_#a33a31] active:translate-y-[3px] active:shadow-[0_2px_0_#a33a31]"
                : "bg-[#ef8527] shadow-[0_5px_0_#b55415] active:translate-y-[3px] active:shadow-[0_2px_0_#b55415]"
            } transition-transform`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
