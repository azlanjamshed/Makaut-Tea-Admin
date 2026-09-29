import React from 'react';
import ConfirmationModal from '../common/ConfirmationModal';

const RestoreUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Restore User?"
      message={`This will restore ${user?.name || 'this user'}'s account access to active status, removing any active suspension or ban.`}
      confirmText="Restore"
      cancelText="Cancel"
      variant="success"
      isLoading={isLoading}
    />
  );
};

export default RestoreUserModal;
