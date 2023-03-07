/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";
import { v4 as uuidv4 } from "uuid";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from "@wordpress/block-editor";
import { Button, TextControl, FormToggle } from "@wordpress/components";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

const createNewPlan = () => ({
	id: uuidv4(),
	name: "New Plan",
	features: [],
	highlight: false,
});

const createNewFeature = () => ({ id: uuidv4(), name: "New Feature" });

const planHasFeature = (plan, feature) => plan.features.includes(feature.id);

const switchItemFromArray = (data, switchedItem) =>
	data.includes(switchedItem)
		? data.filter((item) => item !== switchedItem)
		: [...data, switchedItem];

const switchFeatureInPlan = (plan, feature) => ({
	...plan,
	features: switchItemFromArray(plan.features, feature.id),
});

const sanitizePlans = (plans) =>
	plans.filter((plan) => plan.id && plan.name && plan.features);

const sanitizeFeatures = (features) =>
	features.filter((feature) => feature.id && feature.name);

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
const Edit = ({ attributes, setAttributes }) => {
	const { features, plans } = attributes;

	// Plans

	const updatePlans = (updatedPlans) =>
		setAttributes({ plans: sanitizePlans(updatedPlans) });

	const handleAddPlan = () => updatePlans([...plans, createNewPlan()]);

	const handleDeletePlan = (plan) =>
		updatePlans(plans.filter((p) => p.id !== plan.id));

	const handleUpdatePlanName = (plan, name) => {
		const updatedPlans = plans.map((p) =>
			p.id === plan.id ? { ...p, name } : p
		);
		updatePlans(updatedPlans);
	};

	const handleHighlightPlan = (plan) => {
		const updatedPlans = plans.map((p) =>
			p.id === plan.id ? { ...p, highlight: !p.highlight } : p
		);
		updatePlans(updatedPlans);
	};

	const handleSwitchFeatureOnPlan = (selectedPlan, selectedFeature) => () => {
		const updatedSelectedPlan = switchFeatureInPlan(
			selectedPlan,
			selectedFeature
		);

		const updatedPlans = plans.map((plan) =>
			plan.id === selectedPlan.id ? updatedSelectedPlan : plan
		);

		updatePlans(updatedPlans);
	};

	// Features

	const updateFeatures = (updatedFeatures) =>
		setAttributes({ features: sanitizeFeatures(updatedFeatures) });

	const handleAddFeature = () =>
		updateFeatures([...features, createNewFeature()]);

	const handleUpdateFeatureName = (feature, name) => {
		const updatedFeatures = features.map((f) =>
			f.id === feature.id ? { ...f, name } : f
		);
		updateFeatures(updatedFeatures);
	};

	const handleDeleteFeature = (featureId) =>
		updateFeatures(features.filter((feature) => feature.id !== featureId));

	const gridCellsPerRow = plans.length + 2;
	const gridStyle = {
		gridTemplateColumns: `repeat(${gridCellsPerRow}, 1fr)`,
	};

	return (
		<div {...useBlockProps()}>
			<h1>Features</h1>

			{/* A grid  */}
			<div className="grid-table" style={gridStyle}>
				{/* First row */}
				<div></div>

				{plans.map((plan, index) => (
					<div className="centered">
						<div className="p-10">
							<input
								type="text"
								value={plan.name}
								onChange={(e) => handleUpdatePlanName(plan, e.target.value)}
							/>
						</div>
					</div>
				))}
				<div className="centered">
					<div className="p-10">
						<Button isSmall isPrimary onClick={handleAddPlan}>
							Add Plan
						</Button>
					</div>
				</div>

				{/* Features */}
				{features.map((feature, index) => {
					var isfirst = index === 0;
					var islast = index === features.length - 1;
					return (
						<>
							<div className="centered">
								<div className="p-10">
									<input
										type="text"
										value={feature.name}
										onChange={(e) =>
											handleUpdateFeatureName(feature, e.target.value)
										}
									/>
								</div>
							</div>

							{plans.map((plan) => {
								const boxClass = !plan.highlight
									? ""
									: isfirst
									? "box-grid box-grid-top"
									: islast
									? "box-grid box-grid-bottom"
									: "box-grid";

								return (
									<div className={`centered ${boxClass}`}>
										<input
											type="checkbox"
											checked={planHasFeature(plan, feature)}
											onChange={handleSwitchFeatureOnPlan(plan, feature)}
										/>
									</div>
								);
							})}
							<div className="centered">
								<Button
									isSmall
									isDestructive
									onClick={() => handleDeleteFeature(feature.id)}
								>
									Delete Feature
								</Button>
							</div>
						</>
					);
				})}

				{/* Add feature */}
				<div className="centered">
					<div className="p-10">
						<Button isSmall isPrimary onClick={handleAddFeature}>
							Add Feature
						</Button>
					</div>
				</div>

				{/* Delete plan */}
				{plans.map((plan) => (
					<div className="centered">
						<div className="p-10">
							<Button
								isSmall
								isDestructive
								onClick={() => handleDeletePlan(plan)}
							>
								Delete Plan
							</Button>
							<Button
								isSmall
								variant={plan.highlight ? "primary" : "secondary"}
								onClick={() => handleHighlightPlan(plan)}
							>
								Highlight Plan
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Edit;
