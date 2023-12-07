import React, { useEffect } from 'react'
import Image from 'next/image';

function AddUpdateComment(props) {
    const {user,commentText,addComment,setCommentText, isReply, targetReply,sendReplyComment, isUpdate,cancelReply} = props;
    const placeholder = isReply ? `replying to @${targetReply.user.username}` : 'Add a comment...'
  return (
    <div className='bg-white rounded my-3 w-full'>
        <form className='p-5 grid grid-cols-2 gap-3'>
            <textarea value={commentText} onChange={e => setCommentText(e.target.value)} className='w-full p-3 border-[1px] col-[1/-1] cursor-pointer' rows='4'  type='multi' placeholder={placeholder} />
            <div className='flex justify-between items-center mt-3'>
                {user ? (
                    <Image src={user.image.webp} height={30} width={30} alt={user.username} />
                ) : null}
            </div>
            <div className='place-self-end'>
                {isReply ? (
                    <div className='flex gap-3'>
                        <button className='rounded bg-Soft-Red text-white font-bold p-2 hover:bg-Pale-red transition-all ' onClick={() => cancelReply()}>Cancel</button>
                        <button className='rounded bg-Moderate-blue text-white font-bold p-2 hover:bg-Light-grayish-blue transition-all ' onClick={(e) => sendReplyComment(e)}>Reply</button>
                    </div>
                ) : (
                    <button className='rounded bg-Moderate-blue text-white font-bold p-2 hover:bg-Light-grayish-blue transition-all ' onClick={(e) => addComment(e, isUpdate)}>Send</button>
                )}
            </div>
        </form>
    </div>
  )
}

export default AddUpdateComment
