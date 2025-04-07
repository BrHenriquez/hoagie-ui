import { Text, ActivityIndicator, View, StyleSheet } from "react-native";
import { Card, Button } from "react-native-paper";
import { Comment, User } from "../../types";
import InputStyled from "../Input/InputStyled";

type CommentsProps = {
    commentList: Comment[];
    commentLoading: boolean;
    newComment: string;
    setNewComment: (text: string) => void;
    handleAddComment: () => void;
    user: User | null;
    handleDeleteComment: (commentId: string) => void;
}

const Comments = ({
    commentList,
    commentLoading,
    newComment,
    setNewComment,
    handleAddComment,
    user,
    handleDeleteComment
}: CommentsProps) => {

    return (
        <Card style={styles.commentsCard}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Comments</Text>
                {commentLoading ? (
                    <ActivityIndicator style={styles.loader} />
                ) : (
                    commentList?.length > 0 ? commentList?.map(comment => {
                        const isMyComment = comment?.user?._id === user?._id;
                        return (
                            <View key={comment._id} style={styles.comment}>
                                <View style={{ flex: 1, maxWidth: isMyComment ? '70%' : '100%' }}>
                                    <Text style={styles.commentAuthor}>{isMyComment ? 'You' : comment?.user?.name ?? 'Unknown'}</Text>
                                    <Text style={styles.commentText}>{comment?.text}</Text>
                                    <Text style={styles.commentDate}>
                                        {new Date(comment?.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                                {isMyComment && (
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                                        <Button mode="contained" onPress={() => handleDeleteComment(comment._id)}>
                                            <Text>Delete</Text>
                                        </Button>
                                    </View>
                                )}
                            </View>
                        )
                    }) : <Text style={{ textAlign: 'center' }}>No comments yet</Text>
                )}

                <InputStyled
                    label="Add a comment"
                    value={newComment}
                    onChangeText={setNewComment}
                    style={styles.commentInput}
                    multiline
                />
                <Button
                    mode="contained"
                    onPress={handleAddComment}
                    disabled={!newComment.trim()}
                    style={styles.commentButton}
                >
                    Post Comment
                </Button>
            </Card.Content>
        </Card>
    )
}

export default Comments;

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    commentsCard: {
        marginBottom: 20,
    },
    comment: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    commentAuthor: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentText: {
        marginBottom: 5,
    },
    commentDate: {
        color: '#666',
        fontSize: 12,
    },
    commentInput: {
        marginTop: 10,
        marginBottom: 10,
    },
    commentButton: {
        marginTop: 5,
    },
    loader: {
        marginVertical: 20,
    },
});
