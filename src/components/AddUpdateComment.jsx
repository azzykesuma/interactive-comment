import React, { useEffect } from 'react'
import Image from 'next/image';

function AddUpdateComment(props) {
    const {user,commentText,addComment,setCommentText, isReply, targetReply,sendReplyComment} = props;
    const placeholder = isReply ? `replying to @${targetReply.user.username}` : 'Add a comment...'
  return (
    <div className='bg-white rounded my-3 w-full'>
        <form>
            <textarea value={commentText} onChange={e => setCommentText(e.target.value)} className='w-full p-2' rows='4'  type='multi' placeholder={placeholder} />
            <div className='flex justify-between items-center mt-3'>
                {user ? (
                    <Image src={user.image.webp} height={30} width={30} alt={user.username} />
                ) : null}
                {isReply ? (
                    <button className='rounded bg-Moderate-blue text-white font-bold p-2' onClick={(e) => sendReplyComment(e)}>Send</button>
                ) : (
                    <button className='rounded bg-Moderate-blue text-white font-bold p-2' onClick={(e) => addComment(e)}>Send</button>
                )}
            </div>
        </form>
    </div>
  )
}

export default AddUpdateComment
