export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const like = {
            id,
            title,
            author,
            image
        }
        this.likes.push(like);
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        // if it returns 0, it means that it doesn't exist
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumberLikes() {
        return this.likes.length;
    }
}