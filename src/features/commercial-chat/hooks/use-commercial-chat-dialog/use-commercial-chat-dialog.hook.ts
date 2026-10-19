'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type Dispatch,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from 'react';
import { COMMERCIAL_CHAT_OPEN_EVENT } from '../../commercial-chat.constants';
import type { ChatAction, IChatState } from '../../commercial-chat.types';

export const useCommercialChatDialog = (state: IChatState, dispatch: Dispatch<ChatAction>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const launcherRef = useRef<HTMLElement>(null);
  const { screen, discardIntent } = state;

  useLayoutEffect(() => {
    const openFromTrigger = (event: Event) => {
      if (dialogRef.current?.open || !(event.target instanceof HTMLElement)) {
        return;
      }

      launcherRef.current = event.target;
      dispatch({ type: 'open' });
    };

    document.addEventListener(COMMERCIAL_CHAT_OPEN_EVENT, openFromTrigger);

    return () => document.removeEventListener(COMMERCIAL_CHAT_OPEN_EVENT, openFromTrigger);
  }, [dispatch]);

  useEffect(() => {
    if (!state.isOpen) {
      return;
    }

    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const viewport = window.visualViewport;
    let focusFrame = 0;
    const updateViewport = () => {
      dialog.dataset.compact = String((viewport?.height ?? window.innerHeight) < 520);
      dialog.style.setProperty(
        '--chat-viewport-height',
        `${viewport?.height ?? window.innerHeight}px`,
      );
      dialog.style.setProperty('--chat-viewport-top', `${viewport?.offsetTop ?? 0}px`);
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(() => {
        const active = document.activeElement;

        if (
          active instanceof HTMLElement &&
          dialog.contains(active) &&
          active.matches('input, textarea, select')
        ) {
          active.scrollIntoView({ block: 'nearest' });
        }
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    viewport?.addEventListener('resize', updateViewport);
    viewport?.addEventListener('scroll', updateViewport);

    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('resize', updateViewport);
      viewport?.removeEventListener('resize', updateViewport);
      viewport?.removeEventListener('scroll', updateViewport);
      document.body.style.overflow = previousOverflow;
      dialog.style.removeProperty('--chat-viewport-height');
      dialog.style.removeProperty('--chat-viewport-top');
      delete dialog.dataset.compact;

      if (dialog.open) {
        dialog.close();
      }

      launcherRef.current?.focus({ preventScroll: true });
    };
  }, [state.isOpen]);

  useEffect(() => {
    if (!state.isOpen || state.transition === 'idle') {
      return;
    }

    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    dialog.focus({ preventScroll: true });
    const transition = state.transition;
    let cancelled = false;

    Promise.allSettled(dialog.getAnimations().map((animation) => animation.finished)).then(() => {
      if (!cancelled) {
        dispatch({ type: transition === 'closing' ? 'finish-close' : 'finish-open' });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [state.isOpen, state.transition, dispatch]);

  useEffect(() => {
    if (!state.isOpen || state.transition !== 'idle') {
      return;
    }

    const dialog = dialogRef.current;
    const target =
      dialog?.querySelector<HTMLElement>(
        '[data-chat-safe-action], [aria-invalid="true"], [data-chat-invalid="true"]',
      ) ??
      dialog?.querySelector<HTMLElement>('[data-chat-initial-action]') ??
      dialog;

    target?.focus({ preventScroll: true });
    const body = dialog?.querySelector<HTMLElement>('[data-chat-body]');

    if (body && !dialog?.querySelector('[aria-invalid="true"]')) {
      body.scrollTop = 0;
    }
  }, [
    state.isOpen,
    state.transition,
    screen,
    discardIntent,
    state.validationAttempt,
    state.submission.status,
  ]);

  const open = (event: MouseEvent<HTMLButtonElement>) => {
    if (state.isOpen) {
      return;
    }

    launcherRef.current = event.currentTarget;
    dispatch({ type: 'open' });
  };

  const requestClose = () => dispatch({ type: discardIntent ? 'cancel-discard' : 'request-close' });
  const cancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();

    if (state.transition === 'idle') {
      requestClose();
    }
  };

  const containFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') {
      return;
    }

    if (state.transition !== 'idle') {
      event.preventDefault();

      return;
    }

    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
      ),
    ).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);

    const first = controls[0];
    const last = controls[controls.length - 1];

    if (!first || !last) {
      event.preventDefault();

      return;
    }

    if (
      event.shiftKey &&
      (document.activeElement === first || document.activeElement === event.currentTarget)
    ) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return { dialogRef, open, requestClose, cancel, containFocus };
};
