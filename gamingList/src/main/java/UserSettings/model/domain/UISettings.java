package UserSettings.model.domain;

import lombok.Getter;

public class UISettings {
    @Getter
    private final UITheme theme;
    @Getter
    private final UILanguage lang;
    @Getter
    private final int itemsPerPage;

    protected UISettings(UITheme theme, UILanguage lang, int itemsPerPage) {
        this.theme = theme;
        this.lang = lang;
        this.itemsPerPage = itemsPerPage;
    }
}
