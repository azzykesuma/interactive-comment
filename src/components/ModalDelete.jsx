import React from 'react' 

function ModalDelete(props) {
  const { SetModal, confirmDeleteComment, id } = props;

  function closeModal() {
    SetModal(<div></div>);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[80%] md:w-[25%] bg-white rounded p-5">
        <h1 className="text-2xl font-bold my-3">Delete Comment</h1>
        <p className="text-Grayish-Blue">
          Are you sure you want to delete this comment? This will remove the comment and can&apos;t be undone.
        </p>
        <div className="flex gap-3 justify-center mt-5">
          <button
            onClick={closeModal}
            className="bg-Grayish-Blue text-white py-2 px-5 rounded-lg"
          >
            NO, CANCEL
          </button>
          <button
            onClick={() => confirmDeleteComment(id)}
            className="bg-Soft-Red text-white py-2 px-5 rounded-lg"
          >
            YES, DELETE
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDelete
