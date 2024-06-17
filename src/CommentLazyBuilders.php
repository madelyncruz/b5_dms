<?php

namespace Drupal\b5_dms;

use Drupal\Core\Render\Element\RenderCallbackInterface;
use Drupal\Core\Url;

/**
 * Render callback object for comment lazy builders.
 */
class CommentLazyBuilders implements RenderCallbackInterface {

  /**
   * Callback for #lazy_builder; builds a comment's links.
   *
   * @param string $comment_id
   *   The comment entity ID.
   * @param string $view_mode
   *   The view mode in which the comment entity is being viewed.
   * @param string $langcode
   *   The language in which the comment entity is being viewed.
   * @param string $replies_count
   *   The replies count per comment parent.
   * @param bool $is_in_preview
   *   Whether the comment is currently being previewed.
   * @param bool $has_parent_comment
   *   Whether the comment has parent comment.
   * @param string $theme
   *   The original theme hook for which will serve as the collapse ID.
   *
   * @return array
   *   A renderable array representing the comment links.
   */
  public static function buildLinks($comment_id, $view_mode, $langcode, $replies_count, $is_in_preview, $has_parent_comment, $theme) {
    /** @var \Drupal\comment\CommentLazyBuilders */
    $comment_links = \Drupal::service('comment.lazy_builders')->renderLinks($comment_id, $view_mode, $langcode, $is_in_preview);

    // Add view comment replies link.
    if (!$has_parent_comment && $replies_count > 0) {
      $comment_links['comment']['#links']['comment-view-replies'] = [
        'title' => t('View replies'),
        'count' => $replies_count,
        'id' => $comment_id,
        'theme' => $theme,
        'url' => Url::fromRoute('entity.comment.canonical', ['comment' => $comment_id]),
      ];
    }

    return $comment_links;
  }

}
