
import { generateWiringDiagram, validateUserConnections, validateCircuitClosure } from './wiringLogic';
import { Node, Edge } from 'reactflow';

async function runTests() {
    console.log("🧪 Starting Verification Tests...");

    // Test 1: Auto-Arrange Logic
    console.log("\nTest 1: Auto-Arrange (Fan Circuit)");
    const fanCircuit = ['power-supply', 'mcb', 'distribution-board', 'switch', 'regulator', 'fan'];
    const diagram = generateWiringDiagram(fanCircuit);

    if (diagram.nodes.length === 6) {
        console.log("✅ Correct number of nodes generated");
    } else {
        console.error(`❌ Expected 6 nodes, got ${diagram.nodes.length}`);
    }

    // Test 2: Validation - Correct Circuit (Closed Loop)
    console.log("\nTest 2: Validation (Correct Circuit)");
    const validationResultCorrect = validateUserConnections(diagram.edges, diagram.nodes);
    if (validationResultCorrect.isValid) {
        console.log("✅ Correct circuit passed validation");
    } else {
        console.error("❌ Correct circuit failed validation");
        console.log("Incorrect Edges:", validationResultCorrect.incorrectEdges);
        console.log("Missing Connections:", validationResultCorrect.missingConnections);
        console.log("Circuit Status:", validationResultCorrect.circuitStatus);
    }

    if (validationResultCorrect.circuitStatus.isClosed) {
        console.log("✅ Circuit Closure: Closed");
    } else {
        console.error("❌ Circuit Closure: Open (Expected Closed)");
    }

    // Test 3: Validation - Open Circuit (Broken Neutral)
    console.log("\nTest 3: Validation (Open Circuit - Broken Neutral)");
    // Remove the Neutral return from Fan to DB
    const brokenEdges = diagram.edges.filter(e =>
        !(e.source === 'fan' && e.target === 'distribution-board' && e.sourceHandle === 'fan-n')
    );

    const validationResultOpen = validateUserConnections(brokenEdges, diagram.nodes);

    if (!validationResultOpen.circuitStatus.isClosed) {
        console.log("✅ Open circuit correctly identified");
        console.log(`   Message: ${validationResultOpen.circuitStatus.message}`);
    } else {
        console.error("❌ Open circuit NOT identified (Expected Open)");
    }

    // Test 4: Validation - Short Circuit
    console.log("\nTest 4: Validation (Short Circuit)");
    const shortCircuitEdges: Edge[] = [
        {
            id: 'short-1',
            source: 'power-supply',
            sourceHandle: 'supply-l',
            target: 'power-supply',
            targetHandle: 'supply-n',
            data: {}
        }
    ];

    const validationResultShort = validateUserConnections(shortCircuitEdges, diagram.nodes);
    const shortError = validationResultShort.incorrectEdges.find(e => e.reason.includes('Short Circuit'));

    if (shortError) {
        console.log("✅ Short circuit correctly identified");
    } else {
        console.error("❌ Short circuit NOT identified");
    }

    console.log("\n🏁 Verification Complete");
}

runTests().catch(console.error);
