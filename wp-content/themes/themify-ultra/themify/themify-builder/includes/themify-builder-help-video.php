<?php

defined( 'ABSPATH' ) || exit;
?>

<div id="tb_help_lightbox" onclick="return false;">
<div class="tb_help_lightbox_inner_wrapper" data-active-tab="videos">
    <ul class="tb_help_tabs">
        <li class="tb_help_tab_link tb_help_active_tab" data-type="videos"><?php _e('Videos'); ?></li>
        <li class="tb_help_tab_link" data-type="shortcuts"><?php _e('Shortcuts'); ?></li>
    </ul>
    <div class="tb_help_tab_content" data-type="videos">
        <div class="tb_help_video_wrapper">
            <div class="tb_player_wrapper current" id="tb_help_builder_basics">
                <a href="//youtube.com/embed/FPPce2D8pYI">
                    <span class="tb_player_btn"></span>
                    <img src="//img.youtube.com/vi/FPPce2D8pYI/maxresdefault.jpg"/>
                </a>
            </div>
            <div class="tb_player_wrapper" id="tb_help_responsive_styling">
                <a href="//youtube.com/embed/0He9P2Sp-WY">
                    <span class="tb_player_btn"></span>
                    <img src="//img.youtube.com/vi/0He9P2Sp-WY/maxresdefault.jpg"/>
                </a>
            </div>
            <div class="tb_player_wrapper" id="tb_help_revisions">
                <a href="//youtube.com/embed/Su48Y-hXTR4">
                    <span class="tb_player_btn"></span>
                    <img src="//img.youtube.com/vi/Su48Y-hXTR4/maxresdefault.jpg"/>
                </a>
            </div>
            <div class="tb_player_wrapper" id="tb_help_builder_library">
                <a href="//youtube.com/embed/At-B1O8VOyE">
                    <span class="tb_player_btn"></span>
                    <img src="//img.youtube.com/vi/At-B1O8VOyE/maxresdefault.jpg"/>
                </a>
            </div>
            <div class="tb_player_wrapper" id="tb_help_scrollto_row">
                <a href="//youtube.com/embed/KtFHwH6N30o">
                    <span class="tb_player_btn"></span>
                    <img src="//img.youtube.com/vi/KtFHwH6N30o/maxresdefault.jpg"/>
                </a>
            </div>
            <div class="tb_player_wrapper" id="tb_help_row_frame">
                <a href="//youtube.com/embed/yKFrn76x8nw">
                    <span class="tb_player_btn"></span>
                    <img src="//img.youtube.com/vi/yKFrn76x8nw/maxresdefault.jpg"/>
                </a>
            </div>
        </div>
        <div class="tb_help_menu">
            <ul>
                <li class="current"><a href="#tb_help_builder_basics"><?php _e('Builder Basics','themify')?></a></li>
                <li><a href="#tb_help_responsive_styling"><?php _e('Responsive Styling','themify')?></a></li>
                <li><a href="#tb_help_revisions"><?php _e('Revisions','themify')?></a></li>
                <li><a href="#tb_help_builder_library"><?php _e('Builder Library','themify')?></a></li>
                <li><a href="#tb_help_scrollto_row"><?php _e('ScrollTo Row','themify')?></a></li>
                <li><a href="#tb_help_row_frame"><?php _e('Row/Column Frame','themify')?></a></li>
            </ul>
        </div>
    </div>
    <div class="tb_help_tab_content" data-type="shortcuts">
        <table class="tb_help_shortcuts_table" cellspacing="0">
            <tr>
                <th width="20%"></th>
                <th><?php _e('Mac','themify') ?></th>
                <th><?php _e('Windows','themify') ?></th>
            </tr>
            <tr>
                <td><?php _e('Save','themify') ?></td>
                <td><?php _e('Cmd + S','themify') ?></td>
                <td><?php _e('Ctrl + S','themify') ?></td>
            </tr>
            <tr>
                <td><?php _e('Undo','themify') ?></td>
                <td><?php _e('Cmd + Z','themify') ?></td>
                <td><?php _e('Ctrl + Z','themify') ?></td>
            </tr>
            <tr>
                <td><?php _e('Redo','themify') ?></td>
                <td><?php _e('Cmd + Shift + Z','themify') ?></td>
                <td><?php _e('Ctrl + Shift + Z','themify') ?></td>
            </tr>
            <tr>
                <td><?php _e('Duplicate','themify') ?></td>
                <td><?php _e('Cmd + D','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
                <td><?php _e('Ctrl + D','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
            </tr>
            <tr>
                <td><?php _e('Delete','themify') ?></td>
                <td><?php _e('Cmd + Delete','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
                <td><?php _e('Ctrl + Delete','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
            </tr>
            <tr>
                <td><?php _e('Copy','themify') ?></td>
                <td><?php _e('Cmd + C','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
                <td><?php _e('Ctrl + C','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
            </tr>
            <tr>
                <td><?php _e('Paste','themify') ?></td>
                <td><?php _e('Cmd + V','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
                <td><?php _e('Ctrl + V','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
            </tr>
            <tr>
                <td><?php _e('Paste Styling','themify') ?></td>
                <td><?php _e('Cmd + Shift + V','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
                <td><?php _e('Ctrl + Shift + V','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
            </tr>
            <tr>
                <td><?php _e('Move Up','themify') ?></td>
                <td><?php _e('Cmd + Up Arrow','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
                <td><?php _e('Ctrl + Up Arrow','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
            </tr>
            <tr>
                <td><?php _e('Move Down','themify') ?></td>
                <td><?php _e('Cmd + Down Arrow','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
                <td><?php _e('Ctrl + Down Arrow','themify') ?><span><?php _e('(With a module selected)','themify') ?></span></td>
            </tr>
        </table>
    </div>
    <div class="tb_close_lightbox tf_close"></div>
</div>
</div>
