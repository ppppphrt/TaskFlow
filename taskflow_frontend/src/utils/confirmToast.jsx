/**
 * Confirmation toast utility.
 *
 * Encapsulates the JSX and toast wiring for delete-confirmation prompts so
 * that hooks (data layer) never need to render UI directly.
 *
 * Usage:
 *   import { showConfirmToast } from '../utils/confirmToast';
 *   showConfirmToast({ message: 'Delete this task?', onConfirm: () => deleteTask(id) });
 */

import { toast } from 'react-toastify';

function ConfirmToastContent({ message, onConfirm, onCancel }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-800 mb-2">{message}</p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded"
        >
          Delete
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function showConfirmToast({ message, onConfirm }) {
  let toastId;
  toastId = toast(
    <ConfirmToastContent
      message={message}
      onConfirm={() => { toast.dismiss(toastId); onConfirm(); }}
      onCancel={() => toast.dismiss(toastId)}
    />,
    { autoClose: false, closeButton: false },
  );
}
