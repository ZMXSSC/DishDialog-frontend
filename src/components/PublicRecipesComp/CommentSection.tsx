import React, {useEffect, useState} from 'react';
import {Comment as CommentModel} from "../../models/comment";
import * as RecipesApi from "../../network/recipes_api";
import {Spinner} from "react-bootstrap";
import styles from "../../styles/CommentSection.module.css";
import {formatDate} from "../../utils/formatDate";

interface CommentSectionProps {
    recipeId: string;
}

const CommentSection = ({recipeId}: CommentSectionProps) => {
    const [comments, setComments] = useState<CommentModel[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [showCommentsLoadingError, setShowCommentsLoadingError] = useState(false);

    useEffect(() => {
        async function getComments() {
            try {
                setCommentsLoading(true);
                const fetchedComments = await RecipesApi.fetchComments(recipeId);
                setComments(fetchedComments);
                setShowCommentsLoadingError(false);
            } catch (err) {
                console.error(err);
                setShowCommentsLoadingError(true);
            } finally {
                setCommentsLoading(false);
            }
        }

        getComments();
    }, [recipeId]);

    return (
        <div>
            <h2>Comments:</h2>
            {commentsLoading && <Spinner animation='border' variant='primary'/>}
            {showCommentsLoadingError &&
                <p className={styles.errorMessage}>Something went wrong. Please refresh the page.</p>}
            {!commentsLoading && !showCommentsLoadingError && (
                <>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div className={styles.commentContainer} key={comment._id}>
                                <h2 className={styles.username}>{comment.user.username}:</h2>
                                <p className={styles.comment}>{comment.text}</p>
                                <p className={`${styles.createdAt} createdAt`}>Created
                                    at: {formatDate(comment.createdAt)}</p>
                            </div>
                        ))

                    ) : (
                        <p className={styles.errorMessage}>No comments yet. Be the first one!</p>
                    )}
                </>
            )}
        </div>
    );
}

export default CommentSection;
