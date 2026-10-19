import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useEffect, useRef, type Dispatch } from 'react';
import type { IChatState, ChatAction } from '../../commercial-chat.types';
import { INITIAL_CHAT_STATE } from '../../utils/commercial-chat-flow/commercial-chat-flow.util';
import { COMMERCIAL_CHAT_OPEN_EVENT } from '../../commercial-chat.constants';
import { useCommercialChatDialog } from './use-commercial-chat-dialog.hook';

const openState: IChatState = { ...INITIAL_CHAT_STATE, isOpen: true };
const Harness = ({
  state,
  dispatch,
  controls = true,
}: {
  state: IChatState;
  dispatch: Dispatch<ChatAction>;
  controls?: boolean;
}) => {
  const { dialogRef, open, requestClose, cancel, containFocus } = useCommercialChatDialog(
    state,
    dispatch,
  );

  return (
    <>
      <button onClick={open}>Open</button>
      <dialog ref={dialogRef} tabIndex={-1} onCancel={cancel} onKeyDown={containFocus}>
        {controls ? (
          <>
            <button onClick={requestClose}>Close</button>
            <div data-chat-body>
              <input aria-label="Project" />
              <a href="https://example.com" tabIndex={-1}>
                Excluded
              </a>
              <button disabled>Disabled</button>
              <button>Last</button>
            </div>
          </>
        ) : null}
      </dialog>
    </>
  );
};

describe('UseCommercialChatDialog - Unit Test', () => {
  it('Should tolerate an absent dialog host during opening and navigation', () => {
    // Given: lifecycle state arriving before any dialog ref is attached.
    const dispatch = vi.fn();

    // When: rendering an opening hook without a DOM host.
    const { rerender } = renderHook(({ state }) => useCommercialChatDialog(state, dispatch), {
      initialProps: { state: { ...openState, transition: 'opening' } as IChatState },
    });

    rerender({ state: openState });

    // Then: missing host elements cannot dispatch false animation completions.
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('Should ignore duplicate opening and non-element external events while a modal is open', async () => {
    // Given: an already open modal.
    const dispatch = vi.fn();
    const user = userEvent.setup();
    render(<Harness state={openState} dispatch={dispatch} />);

    // When: triggering both launcher and bubbling external openings.
    await user.click(screen.getByRole('button', { name: 'Open' }));
    screen
      .getByRole('button', { name: 'Open' })
      .dispatchEvent(new Event(COMMERCIAL_CHAT_OPEN_EVENT, { bubbles: true }));
    document.dispatchEvent(new Event(COMMERCIAL_CHAT_OPEN_EVENT));

    // Then: opening again does not reset the existing request.
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('Should ignore external events without a valid invoker when closed', () => {
    // Given: a closed modal listening for commercial triggers.
    const dispatch = vi.fn();
    render(<Harness state={INITIAL_CHAT_STATE} dispatch={dispatch} />);

    // When: dispatching an event on the document itself.
    document.dispatchEvent(new Event(COMMERCIAL_CHAT_OPEN_EVENT));

    // Then: no un-restorable opening is dispatched.
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('Should block Tab and native cancellation during animation and cancel pending completion on unmount', async () => {
    // Given: a controlled opening animation.
    let finish: (animation: Animation) => void = () => undefined;
    const finished = new Promise<Animation>((resolve) => {
      finish = resolve;
    });

    const animation = { finished } as Animation;
    vi.spyOn(HTMLElement.prototype, 'getAnimations').mockReturnValue([animation]);
    const dispatch = vi.fn();
    const { unmount } = render(
      <Harness state={{ ...openState, transition: 'opening' }} dispatch={dispatch} />,
    );

    const dialog = screen.getByRole('dialog');

    // When: attempting interaction before completion and removing the host before the animation resolves.
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    fireEvent(dialog, tab);
    const tabBlocked = tab.defaultPrevented;
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    unmount();
    await act(async () => {
      finish(animation);
    });

    // Then: interaction was blocked and a stale animation cannot change the Controller state.
    expect(tabBlocked).toBe(true);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('Should prevent focus escape without controls and support reverse tab from the dialog fallback', async () => {
    // Given: a modal first without visible controls, then with keyboard-visible controls.
    const dispatch = vi.fn();
    const { rerender } = render(<Harness state={openState} dispatch={dispatch} controls={false} />);
    const dialog = screen.getByRole('dialog');
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });

    // When: tabbing in an empty dialog and then backwards from the fallback focus target.
    fireEvent(dialog, tab);
    const tabBlocked = tab.defaultPrevented;
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue({
      length: 1,
      item: () => null,
      [Symbol.iterator]: () => Array<DOMRect>().values(),
    });
    rerender(<Harness state={openState} dispatch={dispatch} />);
    dialog.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });

    const fallbackFocus = document.activeElement;
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    const reverseFocus = document.activeElement;
    fireEvent.keyDown(dialog, { key: 'Tab' });
    const wrappedFocus = document.activeElement;
    fireEvent.keyDown(dialog, { key: 'Tab' });
    const retainedFocus = document.activeElement;

    // Then: the empty dialog blocks escape, reverse Tab enters the last control and forward Tab wraps.
    expect(tabBlocked).toBe(true);
    expect(fallbackFocus).toBe(screen.getByRole('button', { name: 'Last' }));
    expect(reverseFocus).toBe(fallbackFocus);
    expect(wrappedFocus).toBe(screen.getByRole('button', { name: 'Close' }));
    expect(retainedFocus).toBe(wrappedFocus);
  });

  it('Should update compact viewport geometry, scroll editable focus into view and restore prior body styles', () => {
    // Given: a compact visual viewport with keyboard offset.
    const viewport = Object.assign(new EventTarget(), { height: 400, offsetTop: 24 });
    vi.stubGlobal('visualViewport', viewport);
    const frames: Array<FrameRequestCallback> = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback);

      return frames.length;
    });
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
    document.body.style.overflow = 'clip';
    const { unmount } = render(<Harness state={openState} dispatch={vi.fn()} />);
    const dialog = screen.getByRole('dialog');

    // When: the viewport changes while an editable field has focus.
    screen.getByRole('textbox', { name: 'Project' }).focus();
    viewport.dispatchEvent(new Event('resize'));
    frames[frames.length - 1](0);
    const compact = dialog.getAttribute('data-compact');
    const height = dialog.style.getPropertyValue('--chat-viewport-height');
    const top = dialog.style.getPropertyValue('--chat-viewport-top');
    const scrollCall = scroll.mock.lastCall;
    dialog.removeAttribute('open');
    unmount();

    // Then: the supplied geometry updates correctly, editable focus scrolls and cleanup restores prior styles.
    expect(compact).toBe('true');
    expect(height).toBe('400px');
    expect(top).toBe('24px');
    expect(scrollCall).toEqual([{ block: 'nearest' }]);
    expect(document.body.style.overflow).toBe('clip');
    expect(dialog.style.getPropertyValue('--chat-viewport-height')).toBe('');
    expect(dialog).not.toHaveAttribute('data-compact');
  });

  it('Should cancel an active discard through the close action and wait for rejected animations as well', async () => {
    // Given: an idle discard screen and an animation whose promise rejects.
    const dispatch = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Harness state={{ ...openState, discardIntent: 'close' }} dispatch={dispatch} />,
    );

    // When: requesting close and then finishing an interrupted exit animation.
    await user.click(screen.getByRole('button', { name: 'Close' }));
    const canceled = dispatch.mock.calls.some(([action]) => action.type === 'cancel-discard');
    vi.spyOn(HTMLElement.prototype, 'getAnimations').mockReturnValue([
      { finished: Promise.reject(new Error('Interrupted')) } as Animation,
    ]);
    rerender(<Harness state={{ ...openState, transition: 'closing' }} dispatch={dispatch} />);
    await act(async () => {});

    // Then: closing during discard cancels it and an interrupted animation still finishes the closing lifecycle.
    expect(canceled).toBe(true);
    expect(dispatch).toHaveBeenCalledWith({ type: 'finish-close' });
  });
});

describe('UseCommercialChatDialog - Unit Test', () => {
  it('Should reuse an already opened native dialog without opening it twice', () => {
    // Given: a host that was opened before the controller's open state arrived.
    const dispatch = vi.fn();
    const show = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
    const { rerender } = render(<Harness state={INITIAL_CHAT_STATE} dispatch={dispatch} />);
    const dialog = screen.getByRole('dialog', { hidden: true });
    HTMLDialogElement.prototype.showModal.call(dialog);

    // When: synchronizing the controller with the native host state.
    rerender(<Harness state={openState} dispatch={dispatch} />);

    // Then: showModal is not called again and the host remains open.
    expect(show).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveAttribute('open');
  });
});

describe('UseCommercialChatDialog - Unit Test', () => {
  it('Should register commercial requests before descendant hydration effects can dispatch them', () => {
    // Given: a descendant that emits a request during its first passive hydration effect.
    const dispatch = vi.fn();
    const HydratingTrigger = () => {
      const ref = useRef<HTMLButtonElement>(null);
      useEffect(() => {
        ref.current?.dispatchEvent(new Event(COMMERCIAL_CHAT_OPEN_EVENT, { bubbles: true }));
      }, []);

      return <button ref={ref}>Commercial CTA</button>;
    };

    const HydratingChat = () => {
      const { dialogRef } = useCommercialChatDialog(INITIAL_CHAT_STATE, dispatch);

      return (
        <>
          <HydratingTrigger />
          <dialog ref={dialogRef} />
        </>
      );
    };

    // When: both consumers hydrate in the same React commit.
    render(<HydratingChat />);

    // Then: the request reaches the chat instead of being lost before subscription.
    expect(dispatch).toHaveBeenCalledWith({ type: 'open' });
    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
