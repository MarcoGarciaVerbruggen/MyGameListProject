package Friendship.mode.domain;

import lombok.Getter;

import java.util.UUID;

public class FriendshipID {
    @Getter
    private final UUID id;

    protected FriendshipID(UUID id) {
        this.id = id;
    }
}
