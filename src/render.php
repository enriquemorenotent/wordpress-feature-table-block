<?php $plans = $attributes['plans']; ?>
<?php $features = $attributes['features']; ?>
<?php $gridCellsPerRow = count($plans) + 2; ?>

<div <?php echo get_block_wrapper_attributes(); ?>>
	<h1>Features</h1>

	<div class="grid-table" style="<?= "grid-template-columns: repeat($gridCellsPerRow, 1fr)" ?>">
		<!-- Header row -->
		<div></div>

		<?php foreach ($plans as $plan): ?>
			<div class="centered">
				<div class="p-10">
					<?= $plan['name'] ?>
				</div>
			</div>
		<?php endforeach; ?>

		<div></div>

		<!-- Features row -->
		<?php foreach ($features as $featureIndex => $feature): ?>
			<div class="centered">
				<div class="p-10">
					<?= $feature['name'] ?>
				</div>
			</div>

			<?php foreach ($plans as $plan): ?>
				<?php $isHighlight = $plan['highlight'] ?? false; ?>
				<?php $isFirstFeature = $featureIndex === 0; ?>
				<?php $isLastFeature = $featureIndex === count($features) - 1; ?>

				<?php if ($isHighlight && $isFirstFeature) {
        $classes = 'box-grid box-grid-top';
    } elseif ($isHighlight && $isLastFeature) {
        $classes = 'box-grid box-grid-bottom';
    } elseif ($isHighlight) {
        $classes = 'box-grid';
    } else {
        $classes = '';
    } ?>

				<div class="centered <?= $classes ?>">
					<div class="p-10">
						<?php if (in_array($feature['id'], $plan['features'])): ?>
							Yes
						<?php else: ?>
							No
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>

			<div></div>
		<?php endforeach; ?>
	</div>
</div>

